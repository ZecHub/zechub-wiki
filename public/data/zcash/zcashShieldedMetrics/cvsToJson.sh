#!/bin/bash

# This script converts a CSV file to a JSON file.
# It assumes the CSV has a header row and uses Python's csv and json modules for conversion.
# Usage: ./csv_to_json.sh input.csv output.json

## Created with Grok 10/11/2025, ask for by @dismad8

if [ $# -ne 2 ]; then
    echo "Usage: $0 input.csv output.json"
    exit 1
fi

input_file="$1"
output_file="$2"

# Check if input file exists
if [ ! -f "$input_file" ]; then
    echo "Error: Input file '$input_file' does not exist."
    exit 1
fi

# Use Python to perform the conversion
python3 - <<EOF
import csv
import json
import sys

try:
    with open('$input_file', 'r') as f:
        reader = csv.DictReader(f)
        data = list(reader)
    
    with open('$output_file', 'w') as f:
        json.dump(data, f, indent=4)
    
    print("Conversion successful: $output_file created.")
except Exception as e:
    print("Error during conversion:", str(e), file=sys.stderr)
    sys.exit(1)
EOF

if [ $? -ne 0 ]; then
    echo "Conversion failed."
    exit 1
fi