from flask import Flask, request, jsonify
import requests
from tags import extract_tags_from_url


app = Flask(__name__, static_folder="../frontend", static_url_path="")

# Replace with your actual Pexels API key
PEXELS_API_KEY = "2zaMirq9EMl6fmLfvWojBagmIa5YVhd8HArm8ydG7Mgkvlb03Z1rm66x"
PEXELS_API_URL = "https://api.pexels.com/videos/search"
PEXELS_QUERY_PARAMS = {
    'query': 'random',
    'orientation': 'portrait',
    'per_page': 3
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


# Function to call the Datamuse API for each tag and build a similarity matrix
def build_similarity_matrix(tags):
    # Initialize the similarity matrix as a nested dictionary
    # where each tag will contain a dictionary of similar words with their scores
    similarity_matrix = {}

    for tag in tags:
        # Call the Datamuse API to get similar words for the tag
        response = requests.get(
            f"https://api.datamuse.com/words?rel_jja={tag}")

        # If the request is successful, process the similar words
        if response.status_code == 200:
            similar_words = response.json()

            # Create a dictionary of similar words with their similarity scores
            similarity_matrix[tag] = {
                word_info['word']: word_info['score'] for word_info in similar_words}

        # If the request fails, log an error or handle it accordingly
        else:
            print(f"Error fetching similar words for tag: {tag}")

    return similarity_matrix

# Example usage within your Flask route:


@app.route('/endpoint-to-handle-keyword-data', methods=['POST'])
def handle_keyword_data():
    keyword_watch_data = request.json
    print(keyword_watch_data)
    tags = list(keyword_watch_data.keys())
    # Build the similarity matrix for the tags received from the frontend
    similarity_matrix = build_similarity_matrix(tags)

    # Now you have a similarity matrix that you can use for collaborative filtering
    # The rest of your collaborative filtering logic would go here

    # For now, just return the similarity matrix for demonstration
    return jsonify(similarity_matrix), 200


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(debug=True)
