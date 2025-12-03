from flask import Flask
from flask_cors import CORS
from app.routes import main_bp
import os

app = Flask(__name__)
CORS(app)

app.register_blueprint(main_bp)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)