from flask import Flask, jsonify

app = Flask(__name__, static_folder="../frontend", static_url_path="")

# Your video data as a Python list of dictionaries
videos = [
    {
        "id": 0,
        "src": "https://player.vimeo.com/external/430014215.sd.mp4?s=2c2fedb46aa038dcc4664ad42ef6a0e002bf312a&profile_id=165&oauth2_token_id=57447761"
    },
    {
        "id": 1,
        "src": "https://player.vimeo.com/external/420234573.sd.mp4?s=1ee7e9aafcd3fdd3b3675b35f2a8b2f97f342ac8&profile_id=165&oauth2_token_id=57447761"
    },
    {
        "id": 2,
        "src": "https://player.vimeo.com/external/353226442.sd.mp4?s=ed709010e22497aeffa2977fa3fa32b7573ebcc0&profile_id=165&oauth2_token_id=57447761"
    },
    {
        "id": 3,
        "src": "https://player.vimeo.com/external/398518760.hd.mp4?s=d27e3d698f8dc07ece5fc0e1eb7b8c2404353dac&profile_id=174&oauth2_token_id=57447761"
    },
    {
        "id": 4,
        "src": "https://player.vimeo.com/external/403664239.hd.mp4?s=a718ed37d5fc05c16aa73ef82c87b990edd08110&profile_id=174&oauth2_token_id=57447761"
    },
    {
        "id": 5,
        "src": "https://player.vimeo.com/external/476838909.sd.mp4?s=33e4e8ec8dcd99aefd4eda56737c498ac69c8c1f&profile_id=165&oauth2_token_id=57447761"
    },
    {
        "id": 6,
        "src": "https://player.vimeo.com/external/403270649.hd.mp4?s=b85f22f7ffd137bd50331c1881c0d82631f1f0e7&profile_id=174&oauth2_token_id=57447761"
    },
    {
        "id": 7,
        "src": "https://player.vimeo.com/external/484726216.sd.mp4?s=aacaa372a4b3534f0001cbcab048297287ac022d&profile_id=165&oauth2_token_id=57447761"
    },
    {
        "id": 8,
        "src": "https://player.vimeo.com/external/467819715.sd.mp4?s=a26407997e8fee5bf0bd73c4ebc95938f2be1fdf&profile_id=165&oauth2_token_id=57447761"
    },
    {
        "id": 9,
        "src": "https://player.vimeo.com/external/403274150.hd.mp4?s=d6a01681b4c80af55db60a575e77dcb027e69748&profile_id=174&oauth2_token_id=57447761"
    },
    {
        "id": 10,
        "src": "https://player.vimeo.com/external/479606760.sd.mp4?s=ce79317c33c0ce25b7890b0e52f2852a44704d31&profile_id=165&oauth2_token_id=57447761"
    },
    {
        "id": 11,
        "src": "https://player.vimeo.com/external/406087836.hd.mp4?s=15997cd43798c6a69fc9b836e9456cb379351a9d&profile_id=174&oauth2_token_id=57447761"
    },
    {
        "id": 12,
        "src": "https://player.vimeo.com/external/445636626.sd.mp4?s=55c18176076a373ff73cfec0968f075b6476b46a&profile_id=165&oauth2_token_id=57447761"
    },
    {
        "id": 13,
        "src": "https://player.vimeo.com/external/424984267.sd.mp4?s=40ec9caf11e8eb9ce9763fe56bb6e04bcb5a8d36&profile_id=165&oauth2_token_id=57447761"
    },
    {
        "id": 14,
        "src": "https://player.vimeo.com/external/459254155.sd.mp4?s=21bfa6a12b70160f44e4c620b07822f480864411&profile_id=165&oauth2_token_id=57447761"
    },
    {
        "id": 15,
        "src": "https://player.vimeo.com/external/420234383.sd.mp4?s=bbe7a79800aaced5acde961d42af3838a17d4741&profile_id=165&oauth2_token_id=57447761"
    }
]


@app.route('/videos', methods=['GET'])
def get_videos():
    return jsonify(videos)


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(debug=True)
