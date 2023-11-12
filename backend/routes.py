from flask import request, jsonify
from .pexels_api import fetch_videos_from_pexels
from .datamuse_api import build_similarity_matrix
from .recommendation import find_most_relevant_keyword


def init_app_routes(app):
    @app.route('/videos', methods=['GET'])
    def get_videos():
        videos = fetch_videos_from_pexels()
        return jsonify(videos)

    @app.route('/endpoint-to-handle-keyword-data', methods=['POST'])
    def handle_keyword_data():
        keyword_watch_data = request.json

        # Filter out null values but process the rest
        filtered_keyword_watch_data = {
            k: v for k, v in keyword_watch_data.items() if v is not None}

        # Continue with the process even if some data was filtered out
        tags = list(filtered_keyword_watch_data.keys())
        similarity_matrix = build_similarity_matrix(tags)
        most_relevant_keyword, score = find_most_relevant_keyword(
            filtered_keyword_watch_data, similarity_matrix)

        # Fetch new videos based on the most relevant keyword, if available
        new_videos = fetch_videos_from_pexels(
            most_relevant_keyword) if most_relevant_keyword else []

        return jsonify({
            'most_relevant_keyword': most_relevant_keyword,
            'score': score,
            'videos': new_videos,
            'similarity_matrix': similarity_matrix
        }), 200

    @app.route('/')
    def index():
        return app.send_static_file('index.html')
