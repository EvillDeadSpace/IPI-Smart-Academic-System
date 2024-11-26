import os
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv('TOKEN')
ENDPOINT = os.getenv('ENDPOINT', "https://models.inference.ai.azure.com")
MODEL_NAME = os.getenv('MODEL_NAME', "Mistral-small")
