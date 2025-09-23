#!/bin/bash

numOfBlocks="${1}" 


tip=$(./getBlockCount.sh)
startingBlock=$(( $tip - $numOfBlocks ))
endingBlock=$tip


if [ -f mytxids ]; then
	rm mytxids
fi

./listTXs.sh $startingBlock $endingBlock > mytxids


cat mytxids | xargs -I {} ./tx_type.sh {} "true"