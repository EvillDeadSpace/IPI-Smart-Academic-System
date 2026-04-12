import os

from dotenv import load_dotenv
from mailjet_rest import Client

# Load environment variables from .env file
load_dotenv()

api_key: str | None = os.environ.get("MJ_APIKEY_PUBLIC")
api_secret: str | None = os.environ.get("MJ_APIKEY_PRIVATE")


mailjet: Client = Client(auth=(api_key, api_secret))
