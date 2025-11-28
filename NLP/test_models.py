"""
Test različitih Mistral modela dostupnih preko GitHub Models
"""

import os
from dotenv import load_dotenv
from mistralai import Mistral, UserMessage

load_dotenv()

# Lista mogućih modela za testiranje
possible_models = [
    "Mistral-small",
    "Mistral-small-latest",
    "mistral-small",
    "mistral-small-latest",
    "Mistral-Large",
    "mistral-large",
    "Mistral-7B",
    "mistral-7b-instruct",
    "Mistral-Nemo",
    "mistral-nemo"
]

token = os.getenv("OPEN_API_KEY_MISTRAL")
endpoint = "https://models.inference.ai.azure.com"
client = Mistral(api_key=token, server_url=endpoint)

print("🔍 Testiram dostupne Mistral modele...\n")
print("=" * 60)

working_models = []

for model_name in possible_models:
    try:
        print(f"⏳ Testiram: {model_name}...", end=" ")
        
        response = client.chat.complete(
            model=model_name,
            messages=[UserMessage(content="Hi")],
            max_tokens=10
        )
        
        print(f"✅ RADI!")
        working_models.append(model_name)
        
    except Exception as e:
        error_msg = str(e)
        if "unknown_model" in error_msg:
            print(f"❌ Ne postoji")
        else:
            print(f"❌ Greška: {error_msg[:50]}")

print("\n" + "=" * 60)
print(f"\n🎉 Pronađeni modeli koji rade ({len(working_models)}):")
for model in working_models:
    print(f"  ✅ {model}")

if not working_models:
    print("\n⚠️  NIJEDAN MODEL NE RADI!")
    print("\nMoguća rješenja:")
    print("1. Provjeri da li je GitHub token validan")
    print("2. Provjeri da li imaš pristup GitHub Models")
    print("3. Pokušaj sa drugim API endpointom")
