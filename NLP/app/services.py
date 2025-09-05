#Const for .env
import os
from dotenv import load_dotenv

load_dotenv()

def find_sentence_with_keywords(doc, query):
    keywords = query.lower().split() 
    for sent in doc.sents:
        sentence_text = sent.text.lower()
        if all(keyword in sentence_text for keyword in keywords):
            return sent.text
    return None

def generate_response_with_context(user_msg, context=""):
    """Generiše odgovor koristeći kontekst iz knowledge base"""
    from mistralai import Mistral, UserMessage, SystemMessage

    token = os.getenv("OPEN_API_KEY_MISTRAL")
    endpoint = "https://models.inference.ai.azure.com"
    model_name = "Mistral-small"

    client = Mistral(api_key=token, server_url=endpoint)

    # Sistem poruka sa kontekstom
    system_prompt = f"""Ti si AI asistent za IPI Akademiju Tuzla. 

KONTEKST O IPI AKADEMIJI:
{context}

INSTRUKCIJE:
- Odgovaraj na bosanskom jeziku
- Koristi samo informacije iz datog konteksta
- Budi precizan i kratak
- Ako nemaš informaciju u kontekstu, reci da ne znaš
- Ne izmišljaj informacije
- Budi prijateljski i profesionalan
"""

    response = client.chat.complete(
        model=model_name,
        messages=[
            SystemMessage(content=system_prompt),
            UserMessage(content=user_msg),
        ],
        temperature=0.3,  
        max_tokens=1000,
        top_p=0.9
    )
    return response.choices[0].message.content

def generate_response(user_msg):
    """Zadržava postojeću funkciju za kompatibilnost"""
    return generate_response_with_context(user_msg)
