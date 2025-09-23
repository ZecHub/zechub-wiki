#!/bin/bash

command="${1}"   #1 represent 1st argument
arg1="${2}"      #2 represent 2nd argument
arg2="${3}"      #3 represents 3rd argument
arg3="${4}"      #4 represents 4th argument


user="__cookie__"                                     #set your  username
pw=""      #set your  pw
#port="19000"                                            #set your port 

#user="zkanon"                                     #set your  username
#pw=""      #set your  pw
port="8232"   

credentials="$user:$pw"

if [ "$command" == "getmetrics" ]; then
	myCurl="curl -s --data-binary '{\"jsonrpc\": \"2.0\", \"id\":0, \"method\": \"$command\", \"params\": [] }' -H 'content-type: application/json' http://127.0.0.1:$port"
elif [ "$command" == "getrawmempool" ]; then
        myCurl="curl -s -u $credentials --data-binary '{\"jsonrpc\": \"1.0\", \"id\":\"curltest\", \"method\": \"$command\", \"params\": [$arg1] }' -H 'content-type: application/json' http://127.0.0.1:$port/"
elif [ -n "$arg1" ]; then
        if [ -n "$arg2" ]; then
		myCurl="curl -s -u $credentials --data-binary '{\"jsonrpc\": \"1.0\", \"id\":\"curltest\", \"method\": \"$command\", \"params\": [\"$arg1\", $arg2] }' -H 'content-type: application/json' http://127.0.0.1:$port/"
        else
		myCurl="curl -s -u $credentials --data-binary '{\"jsonrpc\": \"1.0\", \"id\":\"curltest\", \"method\": \"$command\", \"params\": [\"$arg1\"] }' -H 'content-type: application/json' http://127.0.0.1:$port/"
        fi
else
        myCurl="curl -s -u $credentials --data-binary '{\"jsonrpc\": \"1.0\", \"id\":\"curltest\", \"method\": \"$command\", \"params\": [] }' -H 'content-type: application/json' http://127.0.0.1:$port/"
fi

#echo $myCurl

eval $myCurl | jq .result


