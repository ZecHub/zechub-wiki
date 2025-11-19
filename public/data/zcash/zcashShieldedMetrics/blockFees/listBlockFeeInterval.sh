#!/bin/bash

startBlock="${1}"
endBlock="${2}"


#tip=$(./getBlockCount.sh)
#startBlock=$(( $tip - $numOfBlocks ))
#endBlock=$tip


j=0;
feeTotal=0;

if [ -f newDataTotal ]; then
    rm newDataTotal
fi

echo "[" >> newDataTotal

for (( i=$startBlock; $i <= $endBlock; i++ ))
    
    do

    	totalFee=$(./listBlockTXs.sh $i | xargs -n1 ./getTXfeeII.sh | awk '{ print $1}' | paste -sd+ | bc
)
	
	while [ "$totalFee" -eq 0 ]
	do
		#echo $i
		i=$(( $i + 1 ))
		totalFee=$(./listBlockTXs.sh $i | xargs -n1 ./getTXfeeII.sh | awk '{ print $1}' | paste -sd+ | bc)
	done

	#convert To ZEC
        totalFee=$(echo "scale=7; $totalFee / 100000000" | bc)


    	echo "Block $i | $totalFee" | tee -a blockFees.md
    	echo "  {" >> newDataTotal
	echo "    \"Block\": \"$i\"," >> newDataTotal
	echo "    \"Fees\": \"$totalFee\"" >> newDataTotal
	echo "  }," >> newDataTotal

     	# Divide the difference by 3600 to calculate hours/ 60 for minutes
     	#answer=$(bc <<< "scale=2 ; $difference/60")

done

head -n -1 newDataTotal > temp1
cat temp1 > newDataTotal
echo "  }" >> newDataTotal
echo "]" >> newDataTotal

rm temp1 
cat newDataTotal