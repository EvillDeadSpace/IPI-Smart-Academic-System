from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from app.routes import main_bp
import os

app = Flask(__name__)
CORS(app)

# Configure rate limiter WITHOUT default limits (only apply to specific routes)
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    storage_uri="memory://",
)

app.register_blueprint(main_bp)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV", "development") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
