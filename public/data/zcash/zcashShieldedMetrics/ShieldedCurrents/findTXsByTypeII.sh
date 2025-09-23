#!/bin/bash


#numOfBlocks="${1}"
startBlock="${1}"   #1 represent 1st argument
endBlock="${2}"     #2 represent 2st argument
searchType="${3}"   #3 represent 3rd argument



#tip=$(./getBlockCount.sh)
#startBlock=$(( $tip - $numOfBlocks ))
#endBlock=$tip

#"true for no fee


if [ -f mytxids ]; then
	# if we already have txids, dont find again
	:
else
	./listTXs.sh $startBlock $endBlock > mytxids
fi

if [[ "$searchType" == "Transparent" ]]; then

	cat mytxids | xargs -I {} ./tx_type.sh {} "true" | LC_ALL=C grep -v "Transparent,\|Sapling\|Orchard"
#elif [[ "$searchType" == "Sapling" ]]; then

#	cat mytxids | xargs -I {} ./tx_type.sh {} "true" | LC_ALL=C grep "Sapling" | grep -v "Orchard"
else
	cat mytxids | xargs -I {} ./tx_type.sh {} "true" | LC_ALL=C grep $searchType
fi


