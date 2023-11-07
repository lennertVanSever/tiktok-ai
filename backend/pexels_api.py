import requests
from tags import extract_tags_from_url

# Replace with your actual Pexels API key
PEXELS_API_KEY = "2zaMirq9EMl6fmLfvWojBagmIa5YVhd8HArm8ydG7Mgkvlb03Z1rm66x"
PEXELS_API_URL = "https://api.pexels.com/videos/search"
PEXELS_QUERY_PARAMS = {
    'query': 'random',
    'orientation': 'portrait',
    'per_page': 3
}


def fetch_videos_from_pexels():
    headers = {'Authorization': PEXELS_API_KEY}
    response = requests.get(
        PEXELS_API_URL, headers=headers, params=PEXELS_QUERY_PARAMS)
    response.raise_for_status()
    pexels_videos = response.json()['videos']
    videos = [{
        'id': video['id'],
        'src': next((file['link'] for file in video['video_files'] if file['quality'] == 'hd'), None),
        'keys': extract_tags_from_url(video['url'])
    } for video in pexels_videos]
    return videos
