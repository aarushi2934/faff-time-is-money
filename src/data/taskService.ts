import Papa from "papaparse";
import {
  TAGS,
  Tag,
  UserStatus,
  tagPriorityMaps,
  imageMap,
  DEFAULT_IMAGE,
  impactOrder,
  categoryPopularTasks,
} from "./config";

export interface Task {
  id: string;
  title: string;
  time: string;
  timeInMinutes: number;
  impact: "High" | "Medium" | "Low";
  image: string;
  category: Tag[];
  status: UserStatus[];
  isPopular?: boolean;
}

/**
 * Normalizes a string by converting to lowercase and trimming whitespace.
 */
const normalizeString = (str: string): string => str.toLowerCase().trim();

/**
 * Finds an image for a task title using case-insensitive matching.
 * @param title - The task title to find an image for.
 * @returns The image URL or the default image if no match is found.
 */
const findImageForTask = (title: string): string => {
  const normalizedTitle = normalizeString(title);

  // Find a matching key in imageMap using case-insensitive comparison
  const matchingKey = Object.keys(imageMap).find(
    (key) => normalizeString(key) === normalizedTitle
  );

  return matchingKey ? imageMap[matchingKey] : DEFAULT_IMAGE;
};

/**
 * Normalizes and maps status categories to match the defined UserStatus type
 */
const normalizeStatus = (status: string): UserStatus => {
  const normalized = normalizeString(status);
  // Map variants to standard forms
  if (normalized === "parent") return "Parents";
  if (normalized === "parents") return "Parents";
  if (normalized === "single") return "Single";
  if (normalized === "couple") return "Couple";

  // Default fallback
  return "Single";
};

/**
 * Normalizes and maps tags to match the defined Tag constants
 */
const normalizeTag = (tag: string): Tag => {
  const normalized = normalizeString(tag);
  // Map old category names to new display names
  const tagMappings: Record<string, Tag> = {
    "travel and mobility": "Frequent Travel",
    "social and dining": "Likes Brunch",
    "health and fitness": "Health and Fitness",
    "work and career": "Long Work Hours",
    "international living": "NRI/Expats",
    "event planning": "Plan Social Gathering",
    "wedding planning": "Getting Married",
    "pregnancy and baby": "Expecting a Baby",
    "pet care": "Pet Parent",
    "relocation": "Moving Cities",
    "entertainment": "Likes Concert",
  };

  return tagMappings[normalized] || "Health and Fitness"; // Default fallback
};

/**
 * Formats time from hours into a readable string like "1 hr 30 mins".
 * @param timeInHours - The time duration in hours.
 * @returns A formatted time string.
 */
const formatTime = (timeInHours: number): string => {
  if (!timeInHours || timeInHours <= 0) {
    return "0 mins";
  }

  if (timeInHours < 1) {
    return `${Math.round(timeInHours * 60)} mins`;
  }

  const hours = Math.floor(timeInHours);
  const minutes = Math.round((timeInHours - hours) * 60);

  const hourText = `${hours} hr${hours > 1 ? "s" : ""}`;
  const minuteText = minutes > 0 ? ` ${minutes} mins` : "";

  return `${hourText}${minuteText}`;
};

/**
 * Parses time string that might include "hours" or "hour" suffix
 * @param timeStr - Time string like "2 hours", "1 hour", "2.5", etc.
 * @returns Parsed time as number in hours
 */
const parseTimeString = (timeStr: string): number => {
  if (!timeStr) return 0;

  // Remove "hours", "hour", and any extra whitespace, then parse
  const cleanedTime = timeStr.replace(/\s*(hours?)\s*/gi, "").trim();

  return parseFloat(cleanedTime) || 0;
};

/**
 * Parses the raw CSV data into an array of Task objects.
 * @returns A promise that resolves to an array of tasks.
 */
const parseTasksFromCSV = async (): Promise<Task[]> => {
  try {
    const response = await fetch("/data/tasks.csv");
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    return parsed.data.map(
      (row: any, index: number): Task => {
        const title = row.Tasks?.trim() || "Untitled Task";
        const timeInHours = parseTimeString(row["Time(in hrs)"]);

        return {
          id: `task-${index + 1}`,
          title,
          time: formatTime(timeInHours),
          timeInMinutes: Math.round(timeInHours * 60),
          impact: row["Impact(priority)"]?.trim() || "Low",
          image: findImageForTask(title),
          category:
            row.Tags?.split(",").map((t: string) => normalizeTag(t)) || [],
          status:
            row["Status categories"]
              ?.split(",")
              .map((s: string) => normalizeStatus(s)) || [],
        };
      }
    );
  } catch (error) {
    console.error("Error parsing CSV data:", error);
    return []; // Return an empty array on failure
  }
};

// Fetch and parse tasks once, then reuse the result.
export const allTasksPromise: Promise<Task[]> = parseTasksFromCSV();

// The number of tasks to return in the final sorted list
export const TOP_TASK_LIMIT = 15;

// Dynamically generate category filters from the single source of truth.
export const categoryFilters: readonly Tag[] = TAGS;

/**
 * Filters and sorts tasks based on user status and selected tags.
 * @param taskList - The complete list of tasks.
 * @param userStatus - The user's current status (e.g., 'Single').
 * @param userTags - An array of tags selected by the user.
 * @returns A sorted and filtered array of tasks.
 */
export const getTopTasks = (
  taskList: Task[],
  userStatus: UserStatus,
  userTags: string[]
): Task[] => {
  // Case 1: No status selected - return first 15 tasks sorted by impact only
  if (!userStatus) {
    // If categories are selected but no status, still show all tasks by impact
    // This provides a better user experience than showing nothing
    return [...taskList]
      .sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact])
      .slice(0, TOP_TASK_LIMIT);
  }

  // Case 2: Status selected but no categories - show ALL tasks sorted by priority (no 15-task limit)
  if (userTags.length === 0) {
    const normalizedUserStatus = normalizeString(userStatus);
    const priorityMap = tagPriorityMaps[userStatus] || {};

    // Filter tasks that match the user status
    const statusFilteredTasks = taskList.filter((task) => {
      const taskStatuses = task.status.map((status) => normalizeString(status));
      return taskStatuses.includes(normalizedUserStatus);
    });

    // Apply priority scoring based on status preferences
    const tasksWithScores = statusFilteredTasks.map((task) => {
      const taskTags = task.category.map(normalizeString);

      // Find the best (lowest) priority score from all task categories for this user status
      const priorityScore = Math.min(
        ...taskTags.map((tag) => priorityMap[tag] ?? 999)
      );

      return { ...task, priorityScore };
    });

    // Sort by priority score first, then impact, then alphabetically
    tasksWithScores.sort((a, b) => {
      const scoreDiff = a.priorityScore - b.priorityScore;
      if (scoreDiff !== 0) return scoreDiff;

      const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
      if (impactDiff !== 0) return impactDiff;

      return a.title.localeCompare(b.title);
    });

    // Return ALL tasks when only status is selected (no limit)
    return tasksWithScores;
  }

  // Case 3: Both status and categories selected - show popular tasks from each category first
  const normalizedUserStatus = normalizeString(userStatus);
  const normalizedUserTags = userTags.map(normalizeString);
  const priorityMap = tagPriorityMaps[userStatus] || {};

  const filteredTasks = taskList.filter((task) => {
    // Check if user status matches any of the task's statuses
    const taskStatuses = task.status.map((status) => normalizeString(status));
    const statusMatch = taskStatuses.includes(normalizedUserStatus);

    if (!statusMatch) return false;

    // Check if there's at least one overlapping tag
    const taskTags = task.category.map(normalizeString);
    const hasOverlappingTag = normalizedUserTags.some((userTag) =>
      taskTags.includes(userTag)
    );

    // Debug logging for wedding tasks
    if (task.title.toLowerCase().includes('wedding') || task.title.toLowerCase().includes('marriage')) {
      console.log('Wedding task found:', {
        title: task.title,
        taskTags,
        normalizedUserTags,
        hasOverlappingTag,
        statusMatch
      });
    }

    return hasOverlappingTag;
  });

  // Debug logging for filtered results
  if (normalizedUserTags.includes('getting married')) {
    console.log('Filtered wedding tasks:', filteredTasks.filter(t => 
      t.title.toLowerCase().includes('wedding') || t.title.toLowerCase().includes('marriage')
    ).map(t => t.title));
  }

  // Find popular tasks for each selected category
  const popularTasks: Task[] = [];
  const popularTaskIds = new Set<string>();

  normalizedUserTags.forEach((selectedTag) => {
    const popularTaskTitle = categoryPopularTasks[selectedTag];
    if (popularTaskTitle) {
      const normalizedPopularTaskTitle = normalizeString(popularTaskTitle);
      const popularTask = filteredTasks.find(
        (task) => normalizeString(task.title) === normalizedPopularTaskTitle
      );
      if (
        popularTask &&
        !popularTaskIds.has(popularTask.id)
      ) {
        popularTasks.push(popularTask);
        popularTaskIds.add(popularTask.id);
      }
    }
  });

  // Get remaining tasks (excluding popular ones already added) - use task ID for exact matching
  const remainingTasks = filteredTasks.filter(
    (task) => !popularTaskIds.has(task.id)
  );

  // Add priority scores to both popular and remaining tasks
  const popularTasksWithScores = popularTasks.map((task) => {
    const taskTags = task.category.map(normalizeString);
    const overlappingTags = normalizedUserTags.filter((userTag) =>
      taskTags.includes(userTag)
    );

    const priorityScore = Math.min(
      ...overlappingTags.map((tag) => priorityMap[tag] ?? 999)
    );

    return { ...task, priorityScore, isPopular: true };
  });

  const remainingTasksWithScores = remainingTasks.map((task) => {
    const taskTags = task.category.map(normalizeString);
    const overlappingTags = normalizedUserTags.filter((userTag) =>
      taskTags.includes(userTag)
    );

    const priorityScore = Math.min(
      ...overlappingTags.map((tag) => priorityMap[tag] ?? 999)
    );

    return { ...task, priorityScore, isPopular: false };
  });

  // Sort popular tasks by impact, then priority score, then alphabetically
  popularTasksWithScores.sort((a, b) => {
    const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
    if (impactDiff !== 0) return impactDiff;

    const scoreDiff = a.priorityScore - b.priorityScore;
    if (scoreDiff !== 0) return scoreDiff;

    return a.title.localeCompare(b.title);
  });

  // Sort remaining tasks: Category Relevance → Impact → Priority Score → Alphabetical
  remainingTasksWithScores.sort((a, b) => {
    // Calculate category relevance score for any task based on selected categories
    const getCategoryRelevance = (task: any) => {
      const title = task.title.toLowerCase();
      let bestRelevance = 999; // Start with worst relevance
      
      // Check relevance against each selected category and take the best (lowest) score
      normalizedUserTags.forEach(selectedCategory => {
        let relevance = 999;
        
        switch (selectedCategory) {
          case 'getting married':
            if (title.includes('wedding') || title.includes('marriage') || title.includes('bride') || title.includes('groom')) relevance = 0;
            else if (title.includes('bachelor') || title.includes('honeymoon') || title.includes('venue') || title.includes('catering')) relevance = 1;
            else if (title.includes('outfit') || title.includes('photography') || title.includes('gift') || title.includes('invite')) relevance = 2;
            else relevance = 3;
            break;

          case 'expecting a baby':
            if (title.includes('baby') || title.includes('prenatal') || title.includes('pregnancy') || title.includes('maternity')) relevance = 0;
            else if (title.includes('nursery') || title.includes('pediatrician') || title.includes('nanny') || title.includes('childcare')) relevance = 1;
            else relevance = 2;
            break;

          case 'frequent travel':
            if (title.includes('travel') || title.includes('flight') || title.includes('trip') || title.includes('visa')) relevance = 0;
            else if (title.includes('passport') || title.includes('booking') || title.includes('itinerary') || title.includes('cab')) relevance = 1;
            else if (title.includes('luggage') || title.includes('check-in') || title.includes('hotel')) relevance = 2;
            else relevance = 3;
            break;

          case 'health and fitness':
            if (title.includes('fitness') || title.includes('gym') || title.includes('workout') || title.includes('trainer')) relevance = 0;
            else if (title.includes('health') || title.includes('medical') || title.includes('protein') || title.includes('nutrition')) relevance = 1;
            else if (title.includes('wellness') || title.includes('yoga') || title.includes('swimming')) relevance = 2;
            else relevance = 3;
            break;

          case 'pet parent':
            if (title.includes('pet') || title.includes('dog') || title.includes('cat') || title.includes('vet')) relevance = 0;
            else if (title.includes('grooming') || title.includes('boarding') || title.includes('daycare') || title.includes('vaccine')) relevance = 1;
            else relevance = 2;
            break;

          case 'long work hours':
            if (title.includes('office') || title.includes('work') || title.includes('client') || title.includes('meeting')) relevance = 0;
            else if (title.includes('meal') || title.includes('cab') || title.includes('supplies') || title.includes('reminder')) relevance = 1;
            else relevance = 2;
            break;

          case 'moving cities':
            if (title.includes('rental') || title.includes('shifting') || title.includes('moving') || title.includes('relocation')) relevance = 0;
            else if (title.includes('furniture') || title.includes('cleaning') || title.includes('utility') || title.includes('address')) relevance = 1;
            else if (title.includes('technician') || title.includes('wifi') || title.includes('bank')) relevance = 2;
            else relevance = 3;
            break;

          case 'likes brunch':
            if (title.includes('restaurant') || title.includes('brunch') || title.includes('dining') || title.includes('table')) relevance = 0;
            else if (title.includes('food') || title.includes('meal') || title.includes('chef') || title.includes('catering')) relevance = 1;
            else relevance = 2;
            break;

          case 'likes concert':
            if (title.includes('concert') || title.includes('event') || title.includes('ticket') || title.includes('entertainment')) relevance = 0;
            else if (title.includes('hotel') || title.includes('venue') || title.includes('artist') || title.includes('show')) relevance = 1;
            else relevance = 2;
            break;

          case 'nri/expats':
            if (title.includes('visa') || title.includes('passport') || title.includes('nri') || title.includes('expat')) relevance = 0;
            else if (title.includes('account') || title.includes('documents') || title.includes('abroad') || title.includes('cultural')) relevance = 1;
            else relevance = 2;
            break;

          case 'plan social gathering':
            if (title.includes('event') || title.includes('party') || title.includes('gathering') || title.includes('venue')) relevance = 0;
            else if (title.includes('decoration') || title.includes('entertainment') || title.includes('catering') || title.includes('invite')) relevance = 1;
            else relevance = 2;
            break;
        }
        
        // Take the best (lowest) relevance score across all selected categories
        bestRelevance = Math.min(bestRelevance, relevance);
      });
      
      return bestRelevance;
    };

    const aRelevance = getCategoryRelevance(a);
    const bRelevance = getCategoryRelevance(b);
    
    if (aRelevance !== bRelevance) return aRelevance - bRelevance;

    // Then sort by impact (High → Medium → Low)
    const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
    if (impactDiff !== 0) return impactDiff;

    // Then sort by priority score (lower = higher priority)
    const scoreDiff = a.priorityScore - b.priorityScore;
    if (scoreDiff !== 0) return scoreDiff;

    // Finally sort alphabetically
    return a.title.localeCompare(b.title);
  });

  // Combine: Popular tasks first, then remaining tasks sorted by impact → priority → alphabetical
  // This maintains priority scoring while ensuring we show all available exact matches
  return [...popularTasksWithScores, ...remainingTasksWithScores].slice(0, TOP_TASK_LIMIT);
};
