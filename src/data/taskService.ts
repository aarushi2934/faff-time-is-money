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

  // Case 2: Status selected but no categories - filter by status and prioritize by status preferences
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

    return tasksWithScores.slice(0, TOP_TASK_LIMIT);
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

    return hasOverlappingTag;
  });

  // Find popular tasks for each selected category
  const popularTasks: Task[] = [];
  const popularTaskTitles = new Set<string>();

  normalizedUserTags.forEach((selectedTag) => {
    const popularTaskTitle = categoryPopularTasks[selectedTag];
    if (popularTaskTitle) {
      const normalizedPopularTaskTitle = normalizeString(popularTaskTitle);
      const popularTask = filteredTasks.find(
        (task) => normalizeString(task.title) === normalizedPopularTaskTitle
      );
      if (
        popularTask &&
        !popularTaskTitles.has(normalizeString(popularTask.title))
      ) {
        popularTasks.push(popularTask);
        popularTaskTitles.add(normalizeString(popularTask.title));
      }
    }
  });

  // Get remaining tasks (excluding popular ones already added)
  const remainingTasks = filteredTasks.filter(
    (task) => !popularTaskTitles.has(normalizeString(task.title))
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

  // Sort remaining tasks using interleaved approach: Impact → Category Priority → Alphabetical
  // Group tasks by impact level first
  const highImpactTasks = remainingTasksWithScores.filter(task => task.impact === 'High');
  const mediumImpactTasks = remainingTasksWithScores.filter(task => task.impact === 'Medium');
  const lowImpactTasks = remainingTasksWithScores.filter(task => task.impact === 'Low');

  // Sort each impact group by priority score, then alphabetically
  const sortByPriorityThenAlphabetical = (a: any, b: any) => {
    const scoreDiff = a.priorityScore - b.priorityScore;
    if (scoreDiff !== 0) return scoreDiff;
    return a.title.localeCompare(b.title);
  };

  highImpactTasks.sort(sortByPriorityThenAlphabetical);
  mediumImpactTasks.sort(sortByPriorityThenAlphabetical);
  lowImpactTasks.sort(sortByPriorityThenAlphabetical);

  // Combine: Popular tasks first, then High → Medium → Low impact tasks, limited to 15 tasks
  return [...popularTasksWithScores, ...highImpactTasks, ...mediumImpactTasks, ...lowImpactTasks].slice(0, TOP_TASK_LIMIT);
};
