import csv

# Read tasks from both files
def read_tasks(file_path):
    tasks = []
    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            tasks.append(row['Tasks'].strip())
    return tasks

# Read both files
tasks1 = read_tasks('public/data/tasks1.csv')
tasks_existing = read_tasks('public/data/tasks.csv')

# Convert to lowercase for comparison to handle case differences
tasks_existing_lower = [task.lower() for task in tasks_existing]

# Find missing tasks
missing_tasks = []
for task in tasks1:
    if task.lower() not in tasks_existing_lower:
        missing_tasks.append(task)

print(f"Total tasks in tasks1.csv: {len(tasks1)}")
print(f"Total tasks in tasks.csv: {len(tasks_existing)}")
print(f"Missing tasks: {len(missing_tasks)}")
print("\nMissing tasks:")
for i, task in enumerate(missing_tasks, 1):
    print(f"{i}. {task}")
