import random
from collections import defaultdict

# Step 1: Initialize Nested Dictionary for Faster Lookups
student_lookup = defaultdict(lambda: defaultdict(lambda: defaultdict(set)))

# Step 2: Define Student List (Example Data)
students = [
    {"id": 1, "career": "Web Development", "specialization": "Backend", "tech_stack": {"Node.js", "Django"}},
    {"id": 2, "career": "Web Development", "specialization": "Backend", "tech_stack": {"Flask", "Django"}},
    {"id": 3, "career": "System Design", "specialization": "Low-Level", "tech_stack": {"C++", "Java"}},
    {"id": 4, "career": "System Design", "specialization": "High-Level", "tech_stack": {"Python", "Go"}},
    {"id": 5, "career": "Web Development", "specialization": "Backend", "tech_stack": {"Node.js", "Django"}},
    {"id": 6, "career": "Web Development", "specialization": "Backend", "tech_stack": {"Flask", "Spring Boot"}},
]

# Step 3: Preprocess Students into Lookup Dictionary
for student in students:
    career = student["career"]
    specialization = student["specialization"]
    for tech in student["tech_stack"]:
        student_lookup[career][specialization][tech].add(student["id"])


# Step 4: Optimized Matching Function
def match_students_optimized(student_lookup, career, specialization, required_tech_stack):
    """
    Matches students efficiently based on career path, specialization, and overlapping tech stacks.
    Uses dictionary lookups and set intersections for O(1) matching.
    """
    if career not in student_lookup or specialization not in student_lookup[career]:
        return "Invalid career path or specialization"

    # Get students who match at least one tech stack
    matching_students = set()
    for tech in required_tech_stack:
        if tech in student_lookup[career][specialization]:
            matching_students.update(student_lookup[career][specialization][tech])

    if len(matching_students) < 2:
        return "Not enough students to create a match"

    # Convert to list and shuffle for randomness
    matching_students = list(matching_students)
    random.shuffle(matching_students)

    # Create student pairs
    pairs = [(matching_students[i], matching_students[i + 1]) for i in range(0, len(matching_students) - 1, 2)]

    return pairs



backend_matches = match_students_optimized(student_lookup, "Web Development", "Backend", {"Django", "Flask"})
print("Backend Matches:", backend_matches)


system_design_matches = match_students_optimized(student_lookup, "System Design", "Low-Level", {"C++"})
print("System Design Matches:", system_design_matches)


spring_boot_matches = match_students_optimized(student_lookup, "Web Development", "Backend", {"Spring Boot"})
print("Spring Boot Matches:", spring_boot_matches)
