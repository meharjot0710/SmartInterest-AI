import pandas as pd
import numpy as np

# Define the number of rows
num_rows = 300000

# Define subjects and project domains
subjects = ['Operating System', 'DSA', 'Frontend', 'Backend', 'Machine Learning', 'Data Analytics']
project_domains = ['Web Development', 'Data Science', 'Machine Learning', 'AI', 'Robotics', 'Game Development', 'Cybersecurity']

# Generate random data
data = {
    'Student ID': np.arange(1, num_rows + 1),
    'Operating System': np.random.randint(5, 101, num_rows),
    'DSA': np.random.randint(5, 101, num_rows),
    'Frontend': np.random.randint(5, 101, num_rows),
    'Backend': np.random.randint(5, 101, num_rows),
    'Machine Learning': np.random.randint(5, 101, num_rows),
    'Data Analytics': np.random.randint(5, 101, num_rows),
    'Project 1': np.random.choice(project_domains, num_rows, replace=True),
    'Project 2': np.random.choice(project_domains, num_rows, replace=True),
    'Project 3': np.random.choice(project_domains, num_rows, replace=True),
    'Project 4': np.random.choice(project_domains, num_rows, replace=True)
}

# Create a DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv('student_data_s.csv', index=False) 

print(f"Dataset generated and saved as 'student_data_s.csv'")