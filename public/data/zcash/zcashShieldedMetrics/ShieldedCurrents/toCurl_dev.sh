#!/bin/bash

# Dry-run support at the very start
if [ "${1}" = "--dry-run" ] || [ "${1}" = "-n" ]; then
    dry_run=1
    shift
fi

method="$1"
shift

if [ -z "$method" ]; then
    echo "Usage: $0 [--dry-run] <method> [param1] [param2] ..."
    exit 1
fi

if pgrep "zenithserver" > /dev/null; then

      # Zenith RPC
	user="user"           #set your  username
	pw="superSecret"      #set your  pw
	port="8234" 
else
	# Zebra
	user="__cookie__"                                     #set your  username
	pw=$(cat ~/.cache/zebra/.cookie | cut -d ":" -f2-)
      #set your  pw
	port="8232"                                            #set your port 
fi

#Zallet
#port="8237"
credentials="$user:$pw"

if [ "$method" = "getmetrics" ]; then
    URL="http://127.0.0.1:$port"
else
    URL="http://127.0.0.1:$port/"
fi

# === Build params ===
if [[ "$method" =~ ^(getaddresstxids|getaddressbalance|getaddressutxos|getaddressmempool)$ ]]; then
    addr="${1:-}"
    start="${2:-}"
    end="${3:-}"
    if [ -z "$start" ] && [ -z "$end" ]; then
        params_json=$(jq -n --arg addr "$addr" '[ $addr ]')
    else
        params_json=$(jq -n \
          --arg addr "$addr" \
          --arg start "$start" \
          --arg end "$end" '
          [{
            "addresses": (if $addr == "" then [] else [$addr] end),
            start: (if $start != "" then ($start|tonumber) else empty end),
            end:   (if $end   != "" then ($end|tonumber) else empty end)
          }] | del(.[0].start, .[0].end | select(. == null))
        ')
    fi
else
    # Normal methods - keep numbers/booleans correct
    params_json=$(printf '%s\n' "$@" | jq -R -s '
      split("\n")[:-1] |
      map(if . == "true" then true
          elif . == "false" then false
          elif test("^-?[0-9]+(\\.[0-9]+)?$") then tonumber
          else . end)
    ')
    # Methods where FIRST param must stay a NUMBER (not forced to string)
    if [[ "$method" =~ ^(getblockhash|getblocksubsidy|getblocktemplate)$ ]]; then
        # do nothing - keep number
        true
    else
        # Default: force first param to string (for getblock, getrawtransaction, etc.)
        params_json=$(echo "$params_json" | jq 'if length > 0 and (.[0]|type=="number") then .[0]|=tostring else . end')
    fi
fi

# === Dry-run ===
if [ "${dry_run:-}" = "1" ]; then
    echo "=== DRY RUN ==="
    echo "Method : $method"
    echo "Params JSON:"
    echo "$params_json" | jq .
    echo
    echo "Full request:"
    jq -n --arg method "$method" --argjson params "$params_json" '
      { "jsonrpc": "2.0", "id": 1, "method": $method, "params": $params }
    ' | jq .
    exit 0
fi

# === Run ===
if [ "$method" = "getmetrics" ]; then
    jq -n --arg method "$method" --argjson params "$params_json" '
      { "jsonrpc": "2.0", "id": 1, "method": $method, "params": $params }
    ' | curl -s --json @- "$URL" | jq '.result // .'
else
    jq -n --arg method "$method" --argjson params "$params_json" '
      { "jsonrpc": "2.0", "id": 1, "method": $method, "params": $params }
    ' | curl -s -u "$credentials" --json @- "$URL" | jq '.result // .'
fi



