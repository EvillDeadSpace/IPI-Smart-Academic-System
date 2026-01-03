from mailjet_rest import Client
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

api_key = os.environ.get("MJ_APIKEY_PUBLIC")
api_secret = os.environ.get("MJ_APIKEY_PRIVATE")


mailjet = Client(auth=(api_key, api_secret))