from flask import Flask
from flask_cors import CORS

def create_app() -> Flask:
    app: Flask = Flask(__name__)
    CORS(app)

    # Registracija ruta
    from app.routes import bp as routes_bp
    app.register_blueprint(routes_bp)

    return app
