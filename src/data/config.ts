// Defines all possible user tags for type safety and consistency
export const TAGS = [
  "Travel and mobility",
  "Relocation",
  "Social and dining",
  "Entertainment",
  "Wedding Planning",
  "Pregnancy and Baby",
  "Work and Career",
  "International Living",
  "Event Planning",
  "Health and Fitness",
  "Pet Care",
] as const;

export type Tag = typeof TAGS[number];
export type UserStatus = "Single" | "Parents" | "Couple";

// Normalizes tags to lowercase for consistent map keys
const normalize = (tag: string) => tag.toLowerCase().trim();

// Priority maps based on your new matrix
export const tagPriorityMaps: Record<
  UserStatus,
  Partial<Record<string, number>>
> = {
  Parents: {
    [normalize("Pregnancy and Baby")]: 1,
    [normalize("Health and Fitness")]: 2,
    [normalize("Work and Career")]: 3,
    [normalize("Social and dining")]: 4,
    [normalize("Entertainment")]: 5,
    [normalize("Pet Care")]: 6,
    [normalize("International Living")]: 7,
    [normalize("Travel and mobility")]: 8,
    [normalize("Relocation")]: 9,
    [normalize("Event Planning")]: 10,
    [normalize("Wedding Planning")]: 11,
  },
  Single: {
    [normalize("Travel and mobility")]: 1,
    [normalize("Work and Career")]: 2,
    [normalize("Health and Fitness")]: 3,
    [normalize("Social and dining")]: 4,
    [normalize("Pet Care")]: 5,
    [normalize("Entertainment")]: 6,
    [normalize("Relocation")]: 7,
    [normalize("International Living")]: 8,
    [normalize("Event Planning")]: 9,
    [normalize("Wedding Planning")]: 10,
    [normalize("Pregnancy and Baby")]: 11,
  },
  Couple: {
    [normalize("Wedding Planning")]: 1,
    [normalize("Pregnancy and Baby")]: 2,
    [normalize("Travel and mobility")]: 3,
    [normalize("Work and Career")]: 4,
    [normalize("Social and dining")]: 5,
    [normalize("Entertainment")]: 6,
    [normalize("Health and Fitness")]: 7,
    [normalize("Pet Care")]: 8,
    [normalize("International Living")]: 9,
    [normalize("Event Planning")]: 10,
    [normalize("Relocation")]: 11,
  },
};

// Image map for tasks
export const imageMap: Record<string, string> = {
  "Order protein bar": "/image_001_A_premium__unwrapped.png",
  "Order supplements": "/image_002_Top_down_flat_lay_of.png",
  "Book massage": "/image_004_Three_perfectly_smoo.png",
  "Plan meals": "/image_005_A_top_down_flat_lay_.png",
  "Find Personal Trainers": "/image_006_A_single__sleek_dumb.png",
  "Sports Event Bookings": "/image_007_Two_sleek__minimalis.png",
  "Gym Equipment Purchase": "/image_008_A_single__high_end_k.png",
  "Fitness Class Enquiry": "/image_009_A_clean__premium_run.png",
  "Find swimming pool": "/image_010_A_rolled_up__high_qu.png",
  "Send wedding gifts": "/image_011_A_pair_of_minimalist.png",
  "Book flight tickets": "/image_012_A_luxurious__elegant.png",
  "Plan honeymoon travel": "/image_013_A_minimalist__styliz.png",
  "Book wedding vendors": "/image_014_Two_interlocking__el.png",
  "Apply marriage certificate": "/image_015_A_minimalist_clipboa.png",
  "Manage wedding invites": "/image_016_An_elegant__high_qua.png",
  "Manage home setup": "/image_017_A_stack_of_premium__.png",
  "Apply PAN change": "/image_018_A_set_of_sleek__mini.png",
  "Plan wedding venue": "/image_019_An_official_looking_.png",
  "Hire household help": "/image_020_A_small__intricately.png",
  "Plan wedding food": "/image_022_A_small__elegant_men.png",
  "Coordinate wedding shoot": "/image_023_A_vintage_style__min.png",
  "Manage function timelines": "/image_024_A_sleek__modern_hour.png",
  "Register for workshops": "/58.png",
  "Plan baby shower": "/59.png",
  "Order prenatal meds": "/60.png",
  "Buy baby items": "/61.png",
  "Hire prenatal coach": "/62.png",
  "Find maternity items": "/63.png",
  "Book restaurant tables": "/64.png",
  "Fix electronics/devices": "/65.png",
};

// Default image if a specific one isn't found
export const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg";

// The number of tasks to return in the final sorted list (removed limit to show all tasks)
// export const TOP_TASK_LIMIT = 15;

// Impact priority for sorting
export const impactOrder: Record<"High" | "Medium" | "Low", number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

// Popular tasks for each category - these will appear first when categories are selected
export const categoryPopularTasks: Record<string, string> = {
  [normalize("Pregnancy and Baby")]: "Plan baby shower",
  [normalize("Health and Fitness")]: "Find Personal Trainers",
  [normalize("Work and Career")]: "Order office meals",
  [normalize("Social and dining")]: "Book restaurant tables",
  [normalize("Entertainment")]: "Book hotel near concert",
  [normalize("Pet Care")]: "Book pet boarding",
  [normalize("International Living")]: "Apply passport renewal",
  [normalize("Travel and mobility")]: "Get travel itinerary",
  [normalize("Relocation")]: "Search rental homes",
  [normalize("Event Planning")]: "Reserve event venue",
  [normalize("Wedding Planning")]: "Apply marriage certificate",
};
