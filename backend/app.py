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


def predict_watch_time(keyword_watch_data, similarity_matrix):
    # Create a dictionary to hold the predicted watch times
    predicted_watch_times = {}

    # Iterate over each tag for which we have watch data
    for tag, watch_time in keyword_watch_data.items():
        # Iterate over each related tag in our similarity matrix
        for related_tag, similarity_score in similarity_matrix[tag].items():
            # If we don't already have watch data for the related tag
            if related_tag not in keyword_watch_data:
                # Initialize the related tag in our predicted_watch_times if it's not there yet
                if related_tag not in predicted_watch_times:
                    predicted_watch_times[related_tag] = {
                        'total_score': 0, 'weighted_score': 0}

                # Aggregate the weighted score and total similarity score for the related tag
                predicted_watch_times[related_tag]['weighted_score'] += watch_time * \
                    similarity_score
                predicted_watch_times[related_tag]['total_score'] += similarity_score

    # Calculate the final predicted watch time for each related tag by normalizing the weighted score by the total score
    for tag, scores in predicted_watch_times.items():
        if scores['total_score'] > 0:  # Avoid division by zero
            predicted_watch_times[tag] = scores['weighted_score'] / \
                scores['total_score']
        else:
            predicted_watch_times[tag] = 0

    return predicted_watch_times

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

# Inside your handle_keyword_data route


def find_most_relevant_keyword(keyword_watch_data, similarity_matrix):
    # Dictionary to hold the cumulative score of each keyword
    keyword_scores = {}

    # Calculate the weighted score for each similar word based on the watch time
    for keyword, watch_time in keyword_watch_data.items():
        similar_words = similarity_matrix.get(keyword, {})
        for similar_word, score in similar_words.items():
            if similar_word not in keyword_watch_data:  # Avoid keywords already watched
                keyword_scores[similar_word] = keyword_scores.get(
                    similar_word, 0) + (score * watch_time)

    # Find the keyword with the highest cumulative score
    most_relevant_keyword = max(
        keyword_scores, key=keyword_scores.get) if keyword_scores else None
    return most_relevant_keyword, keyword_scores[most_relevant_keyword] if most_relevant_keyword else 0


@app.route('/endpoint-to-handle-keyword-data', methods=['POST'])
def handle_keyword_data():
    keyword_watch_data = request.json
    tags = list(keyword_watch_data.keys())
    similarity_matrix = build_similarity_matrix(tags)

    # Find the most relevant keyword
    most_relevant_keyword, score = find_most_relevant_keyword(
        keyword_watch_data, similarity_matrix)

    # Return the most relevant keyword and its score
    return jsonify({
        'most_relevant_keyword': most_relevant_keyword,
        'score': score
    }), 200


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(debug=True)
