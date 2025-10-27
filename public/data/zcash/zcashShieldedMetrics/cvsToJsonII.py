import csv
import json
import sys

def convert_csv_to_json(csv_file_path, json_file_path=None):
    """
    Converts a CSV file to JSON, automatically detecting numbers (int/float) vs strings.
    
    :param csv_file_path: Path to the input CSV file.
    :param json_file_path: Optional path to the output JSON file. If None, prints to stdout.
    """
    data = []
    
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        
        for row in csv_reader:
            converted_row = {}
            for key, value in row.items():
                # Try to convert value to int or float, else keep as string
                try:
                    if '.' in value:
                        converted_row[key] = float(value)
                    else:
                        converted_row[key] = int(value)
                except ValueError:
                    converted_row[key] = value
            data.append(converted_row)
    
    json_data = json.dumps(data, indent=4)
    
    if json_file_path:
        with open(json_file_path, mode='w', encoding='utf-8') as json_file:
            json_file.write(json_data)
        print(f"JSON written to {json_file_path}")
    else:
        print(json_data)

# Example usage: python csv_to_json.py input.csv output.json
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python csv_to_json.py <input_csv> [output_json]")
        sys.exit(1)
    
    csv_path = sys.argv[1]
    json_path = sys.argv[2] if len(sys.argv) > 2 else None
    
    convert_csv_to_json(csv_path, json_path)