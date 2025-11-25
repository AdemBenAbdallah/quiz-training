import json
import math

# Original files
files = ["level_1.json", "level_2.json", "level_3.json"]

# Number of output files
num_levels = 8

# Load all data
all_data = []
for f in files:
    with open(f, 'r') as file:
        data = json.load(file)
        all_data.append(data)

# Prepare 8 empty lists for output
split_data = [[] for _ in range(num_levels)]

# Split each original file into 8 parts and add to split_data
for data in all_data:
    total_items = len(data)
    split_size = math.ceil(total_items / num_levels)

    for i in range(num_levels):
        start = i * split_size
        end = start + split_size
        split_data[i].extend(data[start:end])

# Save the 8 new files
for i in range(num_levels):
    output_filename = f"level{i+1}.json"
    with open(output_filename, 'w') as out_f:
        json.dump(split_data[i], out_f, indent=2)
    print(f"Created {output_filename} with {len(split_data[i])} items")
