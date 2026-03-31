from googleapiclient.discovery import build
import json
import argparse

def get_youtube_service(api_key):
    return build('youtube', 'v3', developerKey=api_key)

def get_channel_info(youtube, channel_id):
    """Fetch channel name and high-res avatar/icon"""
    request = youtube.channels().list(
        part='snippet',
        id=channel_id
    )
    response = request.execute()
    if 'items' in response and response['items']:
        item = response['items'][0]['snippet']
        # High resolution (best for UI)
        icon_url = item['thumbnails']['high']['url']
        return {
            'channelName': item['title'],
            'channelIcon': icon_url
        }
    else:
        raise ValueError("Channel not found or no snippet data.")

def get_uploads_playlist_id(youtube, channel_id):
    request = youtube.channels().list(
        part='contentDetails',
        id=channel_id
    )
    response = request.execute()
    if 'items' in response and response['items']:
        return response['items'][0]['contentDetails']['relatedPlaylists']['uploads']
    else:
        raise ValueError("Channel not found or no uploads playlist.")

def get_all_video_details(youtube, playlist_id):
    videos = []
    next_page_token = None
    while True:
        request = youtube.playlistItems().list(
            part='snippet,contentDetails',
            playlistId=playlist_id,
            maxResults=50,
            pageToken=next_page_token
        )
        response = request.execute()
        for item in response['items']:
            video_info = {
                'video_id': item['contentDetails']['videoId'],
                'title': item['snippet']['title'],
            }
            videos.append(video_info)
        next_page_token = response.get('nextPageToken')
        if not next_page_token:
            break
    return videos

def get_video_view_counts(youtube, video_ids):
    view_counts = {}
    for i in range(0, len(video_ids), 50):
        chunk = video_ids[i:i+50]
        request = youtube.videos().list(
            part='statistics',
            id=','.join(chunk)
        )
        response = request.execute()
        for item in response['items']:
            video_id = item['id']
            views = int(item['statistics'].get('viewCount', 0))
            view_counts[video_id] = views
    return view_counts

def main(api_key, channel_id):
    youtube = get_youtube_service(api_key)
    
    # NEW: Get channel icon + name once
    channel_info = get_channel_info(youtube, channel_id)
    
    uploads_playlist_id = get_uploads_playlist_id(youtube, channel_id)
    video_details = get_all_video_details(youtube, uploads_playlist_id)
    
    video_ids = [video['video_id'] for video in video_details]
    view_counts = get_video_view_counts(youtube, video_ids)
    
    # Combine everything + add channelIcon to every video
    results = []
    for video in video_details:
        results.append({
            'title': video['title'],
            'video_id': video['video_id'],
            'views': view_counts.get(video['video_id'], 0),
            'channelIcon': channel_info['channelIcon']   # ← NEW FIELD
        })
    
    # Print as JSON (ready for public/data/youtube/)
    print(json.dumps(results, indent=4))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Fetch view counts + channel icon for all videos in a YouTube channel.')
    parser.add_argument('--api_key', required=True, help='Your YouTube Data API key')
    parser.add_argument('--channel_id', required=True, help='The ID of the YouTube channel')
    args = parser.parse_args()
    main(args.api_key, args.channel_id)
