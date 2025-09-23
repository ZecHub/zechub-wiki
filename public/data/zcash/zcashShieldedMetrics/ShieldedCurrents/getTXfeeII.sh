#!/bin/bash

txID="${1}"    #1 represent 1st argument
isShieldedOut=0
isShieldedIn=0

./toCurl.sh getrawtransaction $txID 1 > txidJSON
#rawTx=$txJSON

#Check for Orchard
isOrchard=$(cat txidJSON | jq .orchard)
lenO=${#isOrchard}



#Check for Sapling
isSaplingSpend=$(cat txidJSON | jq .vShieldedSpend)
isSaplingOutput=$(cat txidJSON | jq .vShieldedOutput)
isSapling=0

if [[ -z "$isSaplingSpend" ]] || [[ "$isSaplingSpend" == "[]" ]]; then
    #no Sapling Spend
    isSapling=0
else
    isSapling=1
    #echo "Sapling Spend tx"
fi

if [[ -z "$isSaplingOutput" ]] || [[ "$isSaplingOutput" == "[]" ]]; then
    #no Sapling Output
    isSapling=0
else
    isSapling=1
    #echo "Sapling Output tx"
fi

#Check for Sprout
isSprout=$(cat txidJSON | jq .vjoinsplit)
lenS=${#isSprout}

if [[ "$lenS" -gt 4 ]] ;then
    isShieldedOut=1
fi

#Check vouts
nullCheck=$(cat txidJSON | jq .vout[])

if [[ -n "$nullCheck" ]] && [[ "$nullCheck" != "" ]];then
    
    voutSum=$(cat txidJSON | jq -r '.vout[] | .valueZat' | awk '{s+=$1} END {OFMT="%f";print s}')
    #If coinbase, add lockbox portion see line 63
    #check for mix txids here
    shieldCheck=$(cat txidJSON | jq -r '.orchard.actions | length')
    nullCheck=$(cat txidJSON | jq .vin[])
    if [[ $shieldCheck -gt 0 ]] && [[ -n "$nullCheck" ]];then
   	isShieldedOut=1
    elif [[ $isSapling -eq 1 ]] && [[ -n "$nullCheck" ]];then
	isShieldedOut=1
    fi
else
   isShieldedOut=1
   voutSum=0
fi

#Check vins
nullCheck=$(cat txidJSON | jq .vin[])

if [[ -n "$nullCheck" ]] && [[ "$nullCheck" != "" ]];then
    
    isCoinbase=$(cat txidJSON | jq .vin[] | grep -o coinbase)
    if [[ "$isCoinbase" = "coinbase" ]];then
    	vinSum=$(./toCurl.sh getblocksubsidy | jq .totalblocksubsidy)
    	vinSum=$(echo "($vinSum * 100000000)/1" | bc)
        lockbox=$(./toCurl.sh getblocksubsidy | jq .lockboxstreams[].valueZat)
        voutSum=$(echo "$voutSum + $lockbox" | bc )
    else
        if [[ "$nullCheck" == "[]" ]];then
           isShieldedIn=1
           vinSum=0
        else
           #loop through vins
           length=$(cat txidJSON | jq -r '.vin | length')
           index=0
           if [ -f temp.md ]; then
    		rm temp.md
	   fi

	   while [[ "$index" -lt "$length" ]]
		   do
		   	tempIndex=$(cat txidJSON | jq .vin[$index].vout)
		   	vinSum=$(cat txidJSON | jq .vin[$index].txid | xargs -n1 ./txDetails.sh | jq .vout[$tempIndex].valueZat)
		       	echo $vinSum >> temp.md
		        index=$((($index + 1)))
			
		   done
           
           vinSum=$(cat temp.md | awk '{s+=$1} END {OFMT="%f";print s}')
        fi

	   shieldCheck=$(cat txidJSON | jq -r '.orchard.actions | length')
   	   nullCheck=$(cat txidJSON | jq .vout[])
   	   if [[ $shieldCheck -gt 0 ]] && [[ -n "$nullCheck" ]];then
       		 isShieldedIn=1
   	   elif [[ $isSapling -eq 1 ]] && [[ -n "$nullCheck" ]];then
       		 isShieldedIn=1
   	   fi
    fi
else
    isShieldedIn=1
    vinSum=0
fi

# If Shielded, update Sums based on type of Shielding
outValueBalance=0 #voutSum
inValueBalance=0  #vinSum

#Check voutSum first

if [[ "$isShieldedOut" -eq 1 ]];then
    if [[ "$lenS" -gt 4 ]];then
       outValueBalance=$(cat txidJSON | jq .vjoinsplit[].vpub_newZat | awk '{s+=$1} END {print s}')
    elif [[ "$isSapling" -eq 1 ]];then
        outValueBalance=$(cat txidJSON | jq .valueBalanceZat)
        if [[ -n "$isOrchard" ]] && [[ "$lenO" -gt 4 ]];then
                myOrchard=$(cat txidJSON | jq .orchard.valueBalanceZat)
        	outValueBalance=$(echo "$outValueBalance + $myOrchard" | bc)
	fi
    elif [[ -n "$isOrchard" ]] && [[ "$lenO" -gt 4 ]];then
        outValueBalance=$(cat txidJSON | jq .orchard.valueBalanceZat)    
    else
        echo "debug"
    fi
    outValueBalance=$(echo "$outValueBalance * -1" | bc)
fi

#Check vinSum second
if [[ "$isShieldedIn" -eq 1 ]];then
   #if [ "$lenS" -gt 2 ];then
   #   vinSum=$(cat txidJSON | jq .vjoinsplit[].vpub_newZat)
   if [[ "$isSapling" -eq 1 ]];then
       inValueBalance=$(cat txidJSON | jq .valueBalanceZat)
        if [[ -n "$isOrchard" ]] && [[ "$lenO" -gt 4 ]];then
              myOrchard=$(cat txidJSON | jq .orchard.valueBalanceZat)
              inValueBalance=$(echo "$inValueBalance + $myOrchard" | bc)
	fi
   elif [[ -n "$isOrchard" ]] && [[ "$lenO" -gt 4 ]];then
       inValueBalance=$(cat txidJSON | jq .orchard.valueBalanceZat)    
   else
       echo "debug"
   fi
fi


if [[ "$isSapling" -eq 0 ]] && [[ -z $vinSum ]];then
    if [[ $inValueBalance -lt 0 ]];then
        inValueBalance=0
    fi
    #finalIn=$inValueBalance
elif [[ "$isSapling" -eq 1 ]];then
    if [[ $inValueBalance -lt 0 ]];then
        inValueBalance=0
    fi 
fi

if [[ "$isSapling" -eq 0 ]] && [[ -z "$voutSum" ]];then
    if [[ "$outValueBalance" -lt 0 ]];then
        outValueBalance=0
    fi
    #finalOut=$outValueBalance
elif [[ "$isSapling" -eq 1 ]];then
    if [[ "$outValueBalance" -lt 0 ]];then
        outValueBalance=0
    fi 
fi


#echo "vinSum: $vinSum"
#echo "inValueBalance: $inValueBalance"
#echo "voutSum: $voutSum"
#echo "outValueBalance: $outValueBalance"
 
finalOut=$(echo "$voutSum + $outValueBalance" | bc )
finalIn=$(echo "$vinSum + $inValueBalance" | bc )

#finalOut=$((( $voutSum + $outValueBalance )))
#finalIn=$((( $vinSum + $inValueBalance )))


#if Coinbase tx, swap signs 
if [[ "$isCoinbase" == "coinbase" ]];then
	fee=$(echo "$finalOut - $finalIn"| bc)
else
	fee=$(echo "$finalIn - $finalOut"| bc)
fi


finalOut=$(echo "scale=2; $finalOut / 100000000" | bc)
finalIn=$(echo "scale=2; $finalIn / 100000000" | bc)

#echo "In  : $vinSum ZEC"
#echo "Out : $voutSum ZEC"
#echo "-------------------"
echo "$fee Zats"

if [ -f temp.md ]; then
    rm temp.md
fi

