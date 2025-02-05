import pandas as pd

# Load dataset
file_path = 'student_data_s.csv'  # Update with the actual file path
df = pd.read_csv(file_path)

# Subject columns
subject_cols = ['Operating System', 'DSA', 'Frontend', 'Backend', 'Machine Learning', 'Data Analytics']
project_cols = ['Project 1', 'Project 2', 'Project 3', 'Project 4']

# Ensure subject columns are numeric
df[subject_cols] = df[subject_cols].apply(pd.to_numeric, errors='coerce')

# Define a mapping of subjects to related project domains
subject_to_domain = {
    'Operating System': ['Cybersecurity', 'Robotics','Game Development'],
    'DSA': ['AI', 'Machine Learning','Cybersecurity','Game Development'],
    'Frontend': ['Web Development'],
    'Backend': ['Web Development'],
    'Machine Learning': ['AI', 'Data Science', 'Machine Learning'],
    'Data Analytics': ['Data Science','Machine Learning','AI']
}

# Function to determine interest label
def determine_interest(row):
    top_subjects = row[subject_cols].astype(float).nlargest(3).index.tolist()  # Get top 3 subjects
    student_projects = set(row[project_cols].values)  # Get student's projects
    
    domain_matches = []
    for subj in top_subjects:
        for domain in subject_to_domain.get(subj, []):
            if domain in student_projects:
                domain_matches.append(domain)
    
    if domain_matches:
        return max(set(domain_matches), key=domain_matches.count)  # Most frequent matching domain
    else:
        return 'Exploring'

# Apply the function to each row
df['Interest Label'] = df.apply(determine_interest, axis=1)

# Save labeled dataset
df.to_csv('labeled_student_data_s.csv', index=False)

print("Labeling completed! Saved as labeled_student_data.csv")