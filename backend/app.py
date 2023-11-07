from flask import Flask, jsonify
import requests
from tags import extract_tags_from_url


app = Flask(__name__, static_folder="../frontend", static_url_path="")

# Replace with your actual Pexels API key
PEXELS_API_KEY = "2zaMirq9EMl6fmLfvWojBagmIa5YVhd8HArm8ydG7Mgkvlb03Z1rm66x"
PEXELS_API_URL = "https://api.pexels.com/videos/search"
PEXELS_QUERY_PARAMS = {
    'query': 'random',
    'orientation': 'portrait',
    'per_page': 15
}


def fetch_videos_from_pexels():
    headers = {
        'Authorization': PEXELS_API_KEY
    }
    response = requests.get(
        PEXELS_API_URL, headers=headers, params=PEXELS_QUERY_PARAMS)
    response.raise_for_status()  # This will raise an exception for HTTP error responses
    return response.json()['videos']


@app.route('/videos', methods=['GET'])
def get_videos():
    pexels_videos = fetch_videos_from_pexels()
    videos = [
        {
            'id': video['id'],
            'src': next((file['link'] for file in video['video_files'] if file['quality'] == 'hd'), None),
            # Call your function here
            'keys': extract_tags_from_url(video['url'])
        }
        for video in pexels_videos
    ]
    return jsonify(videos)


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(debug=True)
