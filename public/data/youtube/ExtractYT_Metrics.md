# YouTube Video Metrics

## Create a google key for YouTube Data API v3 


`https://console.cloud.google.com/apis/api/youtube.googleapis.com/metrics`

YOUR_API_KEY=

## Grab a YouTube channel ID

https://www.streamweasels.com/%20tools/youtube-channel-id-and-%20user-id-convertor/

YOUR_CHANNEL_ID=


## Install python support

`sudo apt install python3-googleapi`


## Extract

### View counts of a youtube channel in json format


`curl "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=YOUR_CHANNEL_ID&key=YOUR_API_KEY"`


###  See number of views for each video on channel


`python3 extractYTVideoMetrics.py --api_key YOUR_API_KEY --channel_id YOUR_CHANNEL_ID`


### See number of views for a particular playlist

`python3 extractYTplaylistMetrics.py --api_key YOUR_API_KEY --playlist_id YOUR_PLAYLIST_ID`


## Sort Data as needed

`cat extractedData.json | jq -r 'sort_by(.views) | reverse' | jq -r '.[].views'`




## Sources


[1](https://console.cloud.google.com/apis/api/youtube.googleapis.com/metrics)
[2](https://www.streamweasels.com/%20tools/youtube-channel-id-and-%20user-id-convertor/)

Scripts sourced from grok 1/2/2026 by dismad8















