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

def generate_response_with_rag(user_msg, context="", metadata=None):
    """
    Generiše odgovor koristeći RAG sistem i Mistral AI
    
    Args:
        user_msg: Korisničko pitanje
        context: Relevantan kontekst iz RAG sistema
        metadata: Dodatne informacije o pretraživanju
    
    Returns:
        Odgovor od Mistral AI-ja
    """
    from mistralai import Mistral, UserMessage, SystemMessage

    token = os.getenv("OPEN_API_KEY_MISTRAL")
    endpoint = "https://models.inference.ai.azure.com"
    model_name = "Mistral-small"

    client = Mistral(api_key=token, server_url=endpoint)

    # Unaprijeđen sistem prompt sa RAG kontekstom
    system_prompt = f"""Ti si **pametan i prijateljski AI asistent** za IPI Akademiju Tuzla - vodeću visokoškolsku ustanovu u Bosni i Hercegovini.

🎓 **KONTEKST O IPI AKADEMIJI:**
{context}

📋 **TVOJ ZADATAK:**
- Odgovaraj na **bosanskom jeziku** (latinično ili ćirilično pismo)
- Koristi **samo informacije iz datog konteksta** iznad
- Budi **precizan, informativan i ljubazan**
- Strukturiraj odgovor sa **bullet points** ili sekcijama kada je potrebno
- Ako pitanje nije u kontekstu, ljubazno reci: "Nisam siguran/na u tu informaciju, ali mogu te uputiti na kontakt IPI Akademije."

💡 **STIL ODGOVORA:**
- Kratko i jasno (2-4 rečenice za jednostavna pitanja)
- Detaljnije za kompleksna pitanja (ali ne više od 150 riječi)
- Koristi emoji 🎓 📚 💻 gdje je prikladno
- Završi sa pitanjem ili pozivom na akciju ako je relevantno

⚠️ **VAŽNO:**
- NE izmišljaj podatke
- NE pominji da si AI model
- NE govori o ograničenjima - fokusiraj se na ono što znaš
"""

    # Mistral AI chat sa optimiziranim parametrima za bosanski jezik
    response = client.chat.complete(
        model=model_name,
        messages=[
            SystemMessage(content=system_prompt),
            UserMessage(content=user_msg),
        ],
        temperature=0.4,  # Malo kreativnije za prirodniji jezik
        max_tokens=500,   # Kraći odgovori
        top_p=0.9
    )
    
    return response.choices[0].message.content

def generate_response_with_context(user_msg, context=""):
    """Backward compatibility - koristi RAG verziju"""
    return generate_response_with_rag(user_msg, context)

def generate_response(user_msg):
    """Zadržava postojeću funkciju za kompatibilnost"""
    return generate_response_with_context(user_msg)
