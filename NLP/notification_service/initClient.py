from mailjet_rest import Client
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

api_key: Optional[str] = os.environ.get("MJ_APIKEY_PUBLIC")
api_secret: Optional[str] = os.environ.get("MJ_APIKEY_PRIVATE")


mailjet: Client = Client(auth=(api_key, api_secret))