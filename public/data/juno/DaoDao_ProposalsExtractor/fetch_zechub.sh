#!/bin/bash

# NOTE: Grok was used in creation of this update via dismad8 on 03/02/2026

# ZecHub DAO + SubDAOs Full Extractor
DAO_ADDRESS="${1:-juno1nktrulhakwm0n3wlyajpwxyg54n39xx4y8hdaqlty7mymf85vweq7m6t0y}"

if [ -z "$DAO_ADDRESS" ]; then
  echo "Usage: $0 <dao_address>"
  exit 1
fi

# Cleanup old temp files
rm -f /tmp/dao_*_*.md /tmp/subdaos.md 2>/dev/null

# Function: Extract one DAO into a JSON file
extract_dao_to_file() {
  local addr="$1"
  local output_file="$2"
  local config_file="/tmp/config_${addr: -8}.md"
  local props_file="/tmp/proposals_${addr: -8}.md"

  curl -s "https://indexer.daodao.zone/juno-1/contract/${addr}/daoCore/config" > "$config_file"
  curl -s "https://indexer.daodao.zone/juno-1/contract/${addr}/daoCore/allProposals?recursive=false" > "$props_file"

  # Ensure valid JSON
  jq -e . "$config_file" >/dev/null 2>&1 || echo '{}' > "$config_file"
  jq -e . "$props_file" >/dev/null 2>&1 || echo '[]' > "$props_file"

  local name=$(jq -r '.name // "Unknown"' "$config_file")
  local description=$(jq -r '.description // ""' "$config_file")
  local prop_count=$(curl -s "https://indexer.daodao.zone/juno-1/contract/${addr}/daoCore/proposalCount" | jq -r 'if type == "object" then .count else . end // 0' || echo 0)
  local member_count=$(curl -s "https://indexer.daodao.zone/juno-1/contract/${addr}/daoCore/memberCount" | jq -r 'if type == "object" then .count else . end // 0' || echo 0)

  jq -n \
    --arg addr "$addr" \
    --arg name "$name" \
    --arg desc "$description" \
    --argjson props "$prop_count" \
    --argjson members "$member_count" \
    --slurpfile config "$config_file" \
    --slurpfile props_raw "$props_file" \
    '{
      dao_address: $addr,
      name: $name,
      description: $desc,
      member_count: $members,
      proposal_count: $props,
      config: $config[0],
      proposals: $props_raw[0]
    }' > "$output_file"

  echo "$name : $addr"
}

# Extract Main DAO
main_file="/tmp/dao_main.md"
main_name=$(extract_dao_to_file "$DAO_ADDRESS" "$main_file")

echo
echo "$main_name"


# Get list of subDAOs
curl -s "https://indexer.daodao.zone/juno-1/contract/${DAO_ADDRESS}/daoCore/listSubDaos" > /tmp/subdaos.md
jq -e . /tmp/subdaos.md >/dev/null 2>&1 || echo '[]' > /tmp/subdaos.md

# Extract all subDAOs
sub_files=()
while read -r item; do
  sub_addr=$(echo "$item" | jq -r '.addr // empty')
  if [ -n "$sub_addr" ]; then
    #echo "subDAO : $sub_addr"
    sub_file="/tmp/dao_sub_${sub_addr: -8}.md"
    extract_dao_to_file "$sub_addr" "$sub_file"
    sub_files+=("$sub_file")
  fi
done < <(jq -c 'if type == "array" then .[] else .sub_daos[]? end' /tmp/subdaos.md)

#echo "Total subDAOs extracted: ${#sub_files[@]}"

# Build final JSON using jq -s 
final_file="zechub.json"

jq -s '
  {
    dao_data: .[0],
    subdao_count: (.[1:] | length),
    subdao_data: .[1:]
  }
' "$main_file" "${sub_files[@]}" > "$final_file"

echo
echo "$final_file created!"