from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("API")
print("API Key:", api_key)