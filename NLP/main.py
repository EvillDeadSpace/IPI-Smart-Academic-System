from flask import Flask
from flask_cors import CORS
from app.routes import main_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(main_bp)

if __name__ == '__main__':
    app.run(debug=True)
