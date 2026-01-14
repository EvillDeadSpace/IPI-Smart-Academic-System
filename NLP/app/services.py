#Const for .env
import os
from typing import Optional, Any
from dotenv import load_dotenv

load_dotenv()

def find_sentence_with_keywords(doc: Any, query: str) -> Optional[str]:
    keywords = query.lower().split() 
    for sent in doc.sents:
        sentence_text = sent.text.lower()
        if all(keyword in sentence_text for keyword in keywords):
            return sent.text
    return None

def generate_response_with_rag(user_msg: str, context: str = "", metadata: Optional[dict] = None) -> str:
    """
    Generiše odgovor koristeći RAG sistem i OpenRouter API
    
    Args:
        user_msg: Korisničko pitanje
        context: Relevantan kontekst iz RAG sistema
        metadata: Dodatne informacije o pretraživanju
    
    Returns:
        Odgovor od AI modela kroz OpenRouter
    """
    from openai import OpenAI
    
    # OpenRouter API konfiguracija
    api_key = os.getenv("OPENROUTER_API_KEY")
    model_name = os.getenv("OPENROUTER_MODEL", "mistralai/ministral-3b-2410")
    
    # Fallback na GitHub Models ako OpenRouter nije konfigurisan
    use_github = not api_key or os.getenv("FLASK_ENV") == "development"
    
    if use_github:
        # GitHub Models API (development)
        from mistralai import Mistral, UserMessage, SystemMessage
        
        token = os.getenv("GITHUB_TOKEN")
        endpoint = os.getenv("GITHUB_ENDPOINT", "https://models.github.ai/inference")
        github_model = os.getenv("MISTRAL_MODEL", "mistral-ai/mistral-medium-2505")
        
        client = Mistral(api_key=token, server_url=endpoint)
        
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
        
        response = client.chat.complete(
            model=github_model,
            messages=[
                SystemMessage(content=system_prompt),
                UserMessage(content=user_msg),
            ],
            temperature=0.4,
            max_tokens=500,
            top_p=0.9
        )
        
        return response.choices[0].message.content
    
    else:
        # OpenRouter API (production)
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )
        
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
        
        completion = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_msg}
            ],
            temperature=0.4,
            max_tokens=500,
            top_p=0.9
        )
        
        return completion.choices[0].message.content

def generate_response_with_context(user_msg: str, context: str = "") -> str:
    """Backward compatibility - koristi RAG verziju"""
    return generate_response_with_rag(user_msg, context)

def generate_response(user_msg: str) -> str:
    """Zadržava postojeću funkciju za kompatibilnost"""
    return generate_response_with_context(user_msg)
