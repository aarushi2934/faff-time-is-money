// Quick test to verify data parsing
const testData = `Tasks,Status categories,Tags,Time(in hrs),Impact(priority)
Order Protein Bars,"Couple, Single, Parents","Health and Fitness, Work and Career, International Living, Pregnancy and Baby, Entertainment",2 hours,Low
Research Protein Powders,"Couple, Single, Parents","Health and Fitness, Work and Career, International Living, Pregnancy and Baby, Entertainment",2 hours,High`;

// Simulate the normalization functions
const normalizeString = (str) => str.toLowerCase().trim();

const normalizeStatus = (status) => {
  const normalized = normalizeString(status);
  if (normalized === "parent") return "parents";
  return normalized;
};

const normalizeTag = (tag) => {
  const normalized = normalizeString(tag);
  const tagMappings = {
    "travel and mobility": "travel and mobility",
    "social and dining": "social and dining",
    "health and fitness": "health and fitness",
    "work and career": "work and career",
    "international living": "international living",
    "event planning": "event planning",
    "wedding planning": "wedding planning",
    "pregnancy and baby": "pregnancy and baby",
    "pet care": "pet care",
    relocation: "relocation",
    entertainment: "entertainment",
  };
  return tagMappings[normalized] || normalized;
};

const parseTimeString = (timeStr) => {
  if (!timeStr) return 0;
  const cleanedTime = timeStr.replace(/\s*(hours?)\s*/gi, "").trim();
  return parseFloat(cleanedTime) || 0;
};

// Test parsing
const lines = testData.split("\n");
const headers = lines[0].split(",");
console.log("Headers:", headers);

for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(",");
  const task = parts[0];
  const statusCategories = parts[1]
    .replace(/"/g, "")
    .split(",")
    .map((s) => normalizeStatus(s.trim()));
  const tags = parts[2]
    .replace(/"/g, "")
    .split(",")
    .map((t) => normalizeTag(t.trim()));
  const timeStr = parts[3];
  const impact = parts[4];

  console.log(`Task: ${task}`);
  console.log(`Status Categories: ${JSON.stringify(statusCategories)}`);
  console.log(`Tags: ${JSON.stringify(tags)}`);
  console.log(`Time: ${parseTimeString(timeStr)} hours`);
  console.log(`Impact: ${impact}`);
  console.log("---");
}
