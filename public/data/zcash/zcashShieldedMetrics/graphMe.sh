#!/bin/bash

## Built by Grok, asked for by @dismad8 on 10/12/2025

# Usage: ./graph_script.sh <filename> [column_number] [width] [height] [extra_options]
# Graphs the specified column of numbers from the file as a line plot in the terminal using gnuplot.
# Assumes gnuplot is installed. Column defaults to 1.
# Width defaults to 80, height to 25. Extra options is a string like "ansi" or "utf8 nofeed".
# The file should have space or tab-separated columns, with numbers in the specified column.
# Non-numeric lines are ignored by awk.

if [ $# -lt 1 ]; then
    echo "Usage: $0 <filename> [column_number] [width] [height] [extra_options]"
    exit 1
fi

filename="$1"
column="${2:-1}"
width="${3:-80}"
height="${4:-25}"
extra_options="${5:-}"

# Check if gnuplot is available
if ! command -v gnuplot &> /dev/null; then
    echo "Error: gnuplot is required but not installed."
    exit 1
fi

# Use awk to extract the column and add line numbers (x-axis as row index)
awk -v col="$column" '$col ~ /^[0-9]*\.?[0-9]+$/ {print NR, $col}' "$filename" | \
gnuplot -p -e "
    set terminal dumb size $width, $height $extra_options;
    set title 'Graph of Column $column from $filename';
    set xlabel 'Row Index';
    set ylabel 'Value';
    plot '-' using 1:2 with lines title 'Data';
"