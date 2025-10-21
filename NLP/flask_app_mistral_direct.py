import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Mistral API Configuration (direktno)
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY") or "UUfpEdF9FtWWCvh5yrw1vUpmlIOGWLGX"
MISTRAL_ENDPOINT = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_MODEL = "mistral-small"

# Debug token setup
if not MISTRAL_API_KEY:
    print("⚠️  Mistral API key not found!")
else:
    print(f"✅ Mistral API key found: {MISTRAL_API_KEY[:10]}...")
    print(f"🎯 Using model: {MISTRAL_MODEL}")
    print(f"🔗 Endpoint: {MISTRAL_ENDPOINT}")

def load_knowledge_base():
    """Učitaj fakultetski sadržaj"""
    try:
        possible_paths = [
            'fakultetski_sadržaj.txt',
            './fakultetski_sadržaj.txt',
            '/home/amartubic/mysite/fakultetski_sadržaj.txt',
            os.path.join(os.path.dirname(__file__), 'fakultetski_sadržaj.txt')
        ]
        
        for file_path in possible_paths:
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as file:
                    content = file.read()
                    print(f"✅ Fajl učitan iz {file_path}, dužina: {len(content)}")
                    return content
        
        print(f"❌ Fajl nije pronađen u: {possible_paths}")
        return "Fajl fakultetski_sadržaj.txt nije pronađen."
        
    except Exception as e:
        print(f"❌ Greška pri učitavanju: {e}")
        return f"Greška pri učitavanju fajla: {str(e)}"

KNOWLEDGE_BASE = load_knowledge_base()

# Text preprocessing
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# Search function
def search_relevant_content(query, knowledge_base, max_results=3):
    if not query or not knowledge_base:
        return []
    
    chunks = knowledge_base.split('\n\n')
    chunks = [chunk.strip() for chunk in chunks if chunk.strip()]
    
    if not chunks:
        return []
    
    processed_query = preprocess_text(query)
    processed_chunks = [preprocess_text(chunk) for chunk in chunks]
    
    try:
        vectorizer = TfidfVectorizer(
            stop_words=None,
            max_features=1000,
            ngram_range=(1, 2)
        )
        
        all_texts = [processed_query] + processed_chunks
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        
        query_vector = tfidf_matrix[0:1]
        chunk_vectors = tfidf_matrix[1:]
        
        similarities = cosine_similarity(query_vector, chunk_vectors).flatten()
        top_indices = np.argsort(similarities)[::-1][:max_results]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.1:
                results.append({
                    'content': chunks[idx],
                    'score': float(similarities[idx])
                })
        
        return results
        
    except Exception as e:
        print(f"❌ Greška u pretraži: {e}")
        return []

# Generate AI response using direct Mistral API
def generate_mistral_response(query, context):
    context_text = "\n\n".join([item['content'] for item in context])
    
    # Smart fallback function
    def generate_fallback_response(query, context_text):
        if not context_text:
            return "Nisam pronašao informacije o vašem pitanju."
        
        lines = context_text.split('\n')
        filtered_lines = [line.strip() for line in lines if line.strip() and not line.startswith('#')]
        
        query_lower = query.lower()
        
        # Lokacija
        if any(word in query_lower for word in ['lokacija', 'adresa', 'gdje', 'gde', 'nalazi']):
            location_info = [line for line in filtered_lines if any(word in line.lower() for word in ['zmaja', 'bosne', 'tuzla', 'adresa'])]
            if location_info:
                return f"Naša lokacija je {location_info[0].replace('- ', '')}."
        
        # Programi
        if any(word in query_lower for word in ['program', 'studij', 'smer', 'smjer']):
            program_info = [line for line in filtered_lines if any(word in line.lower() for word in ['program', 'studij', 'informatika', 'ekonomija'])]
            if program_info:
                programs = '\n'.join([f"• {prog.replace('- ', '')}" for prog in program_info[:4]])
                return f"IPI Akademija nudi sledeće studijske programe:\n\n{programs}"
        
        # Kontakt
        if any(word in query_lower for word in ['kontakt', 'telefon', 'email']):
            contact_info = [line for line in filtered_lines if any(word in line.lower() for word in ['kontakt', 'telefon', 'email', '@'])]
            if contact_info:
                return f"Kontakt informacije:\n{contact_info[0].replace('- ', '')}"
        
        # Default
        if filtered_lines:
            return filtered_lines[0].replace('- ', '').strip()
        
        return "Na osnovu dostupnih informacija, možete kontaktirati IPI Akademiju za detalje."
    
    # Try direct Mistral API
    if not MISTRAL_API_KEY:
        print("❌ Mistral API key nedostaje!")
        return generate_fallback_response(query, context_text)
    
    try:
        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json",
        }
        
        prompt = f"""Kontekst o IPI Akademiji:
{context_text}

Pitanje studenta: {query}

Odgovori kratko i prirodno na srpskom jeziku koristeći informacije iz konteksta."""
        
        data = {
            "model": MISTRAL_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": "Ti si AI asistent za IPI Akademiju u Tuzli. Odgovaraj kratko, jasno i prijateljski na srpskom jeziku."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.3,
            "max_tokens": 250
        }
        
        print(f"🔄 Pozivam direktan Mistral API...")
        response = requests.post(MISTRAL_ENDPOINT, headers=headers, json=data, timeout=30)
        
        print(f"📊 Mistral API Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            ai_response = result["choices"][0]["message"]["content"]
            print(f"✅ Mistral odgovor: {ai_response[:100]}...")
            return ai_response
        elif response.status_code == 401:
            print("❌ 401 Unauthorized - Mistral API key problem")
        elif response.status_code == 429:
            print("❌ 429 Rate limit exceeded")
        else:
            print(f"❌ Mistral API Error {response.status_code}: {response.text}")
        
        return generate_fallback_response(query, context_text)
            
    except requests.exceptions.Timeout:
        print("❌ Mistral API timeout")
        return generate_fallback_response(query, context_text)
    except Exception as e:
        print(f"❌ Mistral API greška: {str(e)}")
        return generate_fallback_response(query, context_text)

# Routes
@app.route('/')
def home():
    return jsonify({
        "message": "NLP servis sa direktnim Mistral API-jem!",
        "endpoints": ["/search", "/status", "/debug", "/test-mistral"]
    })

@app.route('/status')
def status():
    return jsonify({
        "status": "active",
        "service": "NLP Chat Service with Direct Mistral API",
        "version": "2.0"
    })

@app.route('/debug')
def debug():
    return jsonify({
        "current_directory": os.getcwd(),
        "files_in_directory": os.listdir('.'),
        "knowledge_base_length": len(KNOWLEDGE_BASE),
        "knowledge_base_preview": KNOWLEDGE_BASE[:200] + "..." if len(KNOWLEDGE_BASE) > 200 else KNOWLEDGE_BASE,
        "mistral_api_key_present": bool(MISTRAL_API_KEY),
        "mistral_api_key_length": len(MISTRAL_API_KEY) if MISTRAL_API_KEY else 0,
        "mistral_endpoint": MISTRAL_ENDPOINT,
        "mistral_model": MISTRAL_MODEL
    })

@app.route('/test-mistral')
def test_mistral():
    """Test direktnog Mistral API-ja"""
    if not MISTRAL_API_KEY:
        return jsonify({"error": "Mistral API key not found"})
    
    try:
        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json",
        }
        
        data = {
            "model": MISTRAL_MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": "Reci zdravo na srpskom jeziku."
                }
            ],
            "temperature": 0.3,
            "max_tokens": 50
        }
        
        print(f"🔄 Testiram Mistral API: {MISTRAL_ENDPOINT}")
        response = requests.post(MISTRAL_ENDPOINT, headers=headers, json=data, timeout=30)
        
        return jsonify({
            "status_code": response.status_code,
            "response_text": response.text[:500],
            "headers": dict(response.headers),
            "endpoint": MISTRAL_ENDPOINT
        })
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "error_type": type(e).__name__
        })

@app.route('/search', methods=['POST'])
def search():
    try:
        data = request.json
        query = data.get('word', '')
        
        if not query:
            return jsonify({"error": "Query parameter 'word' is required"})
        
        print(f"🔍 Pretraga za: {query}")
        
        # Search relevant content
        context = search_relevant_content(query, KNOWLEDGE_BASE)
        print(f"📄 Pronađeno {len(context)} relevantnih rezultata")
        
        # Generate response
        response = generate_mistral_response(query, context)
        
        return jsonify({
            "query": query,
            "response": response,
            "context_used": context
        })
        
    except Exception as e:
        print(f"❌ Greška u /search: {str(e)}")
        return jsonify({"error": f"Greška u pretraži: {str(e)}"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)
