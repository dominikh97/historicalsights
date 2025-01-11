import json

# Define the path to the selectedNode.json file (assuming it's in the same directory as this script)
file_path = 'selectedNode.json'

# Function to read the JSON file and print its contents
def read_selected_node():
    try:
        # Open and load the JSON data from the file
        with open(file_path, 'r') as file:
            data = json.load(file)
            print("Selected Node Data:")
            print(json.dumps(data, indent=4))  # Pretty print with indentation
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
    except json.JSONDecodeError:
        print("Error: Failed to decode JSON from the file.")

# Run the function
if __name__ == '__main__':
    read_selected_node()
