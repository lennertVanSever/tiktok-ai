from flask import Flask, jsonify
import json

app = Flask(__name__, static_folder="../frontend", static_url_path="")

@app.route('/videos', methods=['GET'])
def get_videos():
    with open('videos.json', 'r') as f:
        videos = json.load(f)
    return jsonify(videos)

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)
