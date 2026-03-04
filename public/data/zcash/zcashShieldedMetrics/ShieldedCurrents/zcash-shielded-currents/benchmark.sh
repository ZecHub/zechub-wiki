#!/bin/bash

max="${1}"     # $1 represent first argument
skipfees="${2}"

echo
echo "running zcash-shielded-currents"
echo "-------------------------------"
echo "between blocks [3248829,3256893]"
echo "with different parallel options [2 through $max]"
echo "without fees: $skipfees"
echo

for (( i=2; i <= max; i*=2 )) 
do
	if [[ "$skipfees" == "true" ]]; then 
		result=$(./target/release/zcash-shielded-currents --out ./results --from 3248829 --to 3256893 --parallel $i --skip-fees)
	else
		result=$(./target/release/zcash-shielded-currents --out ./results --from 3248829 --to 3256893 --parallel $i)
	fi

	echo "$result" > result
	result=$(cat result | grep "Completed")
        error=$(cat result | grep "Error")
	echo "parallel=$i | batch-size=80 | $result | $error"
done

max=600

for (( i=40; i <= max; i+=40 )) 
do
	if [[ "$skipfees" == "true" ]]; then 
		result=$(./target/release/zcash-shielded-currents --out ./results --from 3248829 --to 3256893 --parallel 32 --batch-size $i --skip-fees)
	else
		result=$(./target/release/zcash-shielded-currents --out ./results --from 3248829 --to 3256893 --parallel 32 --batch-size $i)
	fi

	echo "$result" > result
	result=$(cat result | grep "Completed")
	error=$(cat result | grep "Error")
	echo "parallel= 32 | batch-size=$i | $result | $error"
done

rm result
echo
echo
echo "====================================="
cat results/summaryOnly.md
