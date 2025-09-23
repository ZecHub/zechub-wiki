#!/bin/bash

startBlock="${1}"   #1 represent 1st argument
endBlock="${2}"     #2 represent 2st argument

zero="0"

mapfile -t myResult < <(./findTXsByTypeII.sh $startBlock $endBlock Orchard) # | sed 's/\x1B\[[0-9;]\{1,\}[A-Za-z]//g')

length=${#myResult[@]}
i=0
mySum=0

if [ -f myResultsOutO.md ]; then
    rm myResultsOutO.md
fi

echo "------------------"

while [[ i -lt length ]]
do
	check=$(echo ${myResult[$i]} | awk '{ print $24}')
	if (( $(echo "$check > $zero" |bc -l) )); then
		echo ${myResult[$i]} >> myResultsOutO.md      
	fi
        i=$(( $i + 1 ))
done

cat myResultsOutO.md | column -t

if [ -f dataOutO.md ]; then
    rm dataOutO.md
fi

if [ -f myResultsOutO.md ]; then
    cat myResultsOutO.md | awk '{ print $24}' >> dataOutO.md
    mySum=$(cat myResultsOutO.md | awk '{ print $24}' | paste -sd+ | bc)
fi


echo "------------------"
echo
echo "Total ZEC moved out of the Orchard Pool: $mySum"
