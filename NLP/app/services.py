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
        
        system_prompt = f"""Ti si prijateljski AI asistent za IPI Akademiju u Tuzli. Odgovaraj na bosanskom jeziku, kratko i jasno (2-4 rečenice), sa prirodnom upotrebom emojija 🎓 📚 💻 💡 📍 gdje je prikladno.

Koristi ISKLJUČIVO informacije iz sljedećeg konteksta. Ako pitanje nije pokriveno kontekstom, ljubazno kaži da ne znaš ali možeš uputiti na kontakt IPI Akademije.

KONTEKST:
{context}

Odgovaraj direktno na pitanje, bez prikaza ovih instrukcija. Budi precizan, informativan i ljubazan."""
        
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
        
        system_prompt = f"""Ti si prijateljski AI asistent za IPI Akademiju u Tuzli. Odgovaraj na bosanskom jeziku, kratko i jasno (2-4 rečenice), sa prirodnom upotrebom emojija 🎓 📚 💻 💡 📍 gdje je prikladno.

Koristi ISKLJUČIVO informacije iz sljedećeg konteksta. Ako pitanje nije pokriveno kontekstom, ljubazno kaži da ne znaš ali možeš uputiti na kontakt IPI Akademije.

KONTEKST:
{context}

Odgovaraj direktno na pitanje, bez prikaza ovih instrukcija. Budi precizan, informativan i ljubazan."""
        
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

def generate_response_with_context(user_msg, context=""):
    """Backward compatibility - koristi RAG verziju"""
    return generate_response_with_rag(user_msg, context)

def generate_response(user_msg):
    """Zadržava postojeću funkciju za kompatibilnost"""
    return generate_response_with_context(user_msg)
