from flask import Flask
from views import init_app_routes

app = Flask(__name__, static_folder="../frontend", static_url_path="")

# Initialize routes
init_app_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
