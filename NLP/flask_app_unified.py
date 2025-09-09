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

# GitHub Models Configuration
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
ENDPOINT = "https://models.inference.ai.azure.com"
MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.1"

# Load knowledge base
def load_knowledge_base():
    try:
        # Try multiple possible paths
        possible_paths = [
            'fakultetski_sadržaj.txt',
            '/home/AmarTubic/mysite/fakultetski_sadržaj.txt',
            'mysite/fakultetski_sadržaj.txt'
        ]
        
        for file_path in possible_paths:
            print(f"Trying to load file: {file_path}")
            
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as file:
                    content = file.read()
                    print(f"File loaded successfully from {file_path}, content length: {len(content)}")
                    return content
        
        print(f"File not found in any of these paths: {possible_paths}")
        print(f"Current directory: {os.getcwd()}")
        print(f"Files in current directory: {os.listdir('.')}")
        return "Fajl fakultetski_sadržaj.txt nije pronađen."
        
    except Exception as e:
        print(f"Error loading file: {e}")
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
    
    # Split knowledge base into chunks
    chunks = knowledge_base.split('\n\n')
    chunks = [chunk.strip() for chunk in chunks if chunk.strip()]
    
    if not chunks:
        return []
    
    # Preprocess query and chunks
    processed_query = preprocess_text(query)
    processed_chunks = [preprocess_text(chunk) for chunk in chunks]
    
    # Create TF-IDF vectors
    try:
        vectorizer = TfidfVectorizer(
            stop_words=None,
            max_features=1000,
            ngram_range=(1, 2)
        )
        
        all_texts = [processed_query] + processed_chunks
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        
        # Calculate cosine similarity
        query_vector = tfidf_matrix[0:1]
        chunk_vectors = tfidf_matrix[1:]
        
        similarities = cosine_similarity(query_vector, chunk_vectors).flatten()
        
        # Get top results
        top_indices = np.argsort(similarities)[::-1][:max_results]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.1:  # Threshold for relevance
                results.append({
                    'content': chunks[idx],
                    'score': float(similarities[idx])
                })
        
        return results
        
    except Exception as e:
        print(f"Error in search: {e}")
        return []

# Generate AI response
def generate_mistral_response(query, context):
    context_text = "\n\n".join([item['content'] for item in context])
    
    # Smart fallback response
    def generate_fallback_response(query, context_text):
        if not context_text:
            return "Nisam pronašao informacije o vašem pitanju."
        
        # Clean up context
        lines = context_text.split('\n')
        filtered_lines = [line.strip() for line in lines if line.strip() and not line.startswith('#')]
        
        # Smart responses based on keywords
        query_lower = query.lower()
        
        if any(word in query_lower for word in ['cijena', 'cena', 'košta', 'kosta', 'uplata', 'novac']):
            price_info = [line for line in filtered_lines if any(word in line.lower() for word in ['cijena', 'cena', 'košta', 'kosta', 'uplata', 'din', 'eur', 'novac'])]
            if price_info:
                return f"Informacije o cijeni fakulteta:\n\n{' '.join(price_info[:2])}"
        
        if any(word in query_lower for word in ['program', 'studij', 'smer', 'smjer']):
            program_info = [line for line in filtered_lines if any(word in line.lower() for word in ['program', 'studij', 'smer', 'smjer', 'informatika', 'ekonomija'])]
            if program_info:
                return f"Studijski programi IPI Akademije:\n\n{' '.join(program_info[:3])}"
        
        if any(word in query_lower for word in ['kontakt', 'adresa', 'telefon', 'email']):
            contact_info = [line for line in filtered_lines if any(word in line.lower() for word in ['kontakt', 'adresa', 'telefon', 'email', 'tuzla'])]
            if contact_info:
                return f"Kontakt informacije:\n\n{' '.join(contact_info[:2])}"
        
        # General response - first few relevant lines
        response = "Na osnovu dostupnih informacija o IPI Akademiji:\n\n"
        response += '\n'.join(filtered_lines[:3])
        
        return response
    
    # Try GitHub Models API
    if not GITHUB_TOKEN:
        print("GitHub token not found, using fallback")
        return generate_fallback_response(query, context_text)
    
    try:
        headers = {
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "Content-Type": "application/json",
        }
        
        # Simpler prompt for better results
        prompt = f"""Kontekst o IPI Akademiji:
{context_text}

Pitanje studenta: {query}

Odgovori kratko i jasno na srpskom jeziku koristeći samo informacije iz konteksta."""
        
        data = {
            "messages": [
                {
                    "role": "system",
                    "content": "Ti si AI asistent za IPI Akademiju u Tuzli. Odgovaraj kratko, jasno i prijateljski na srpskom jeziku. Koristi samo informacije iz konteksta."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "model": MODEL_NAME,
            "temperature": 0.2,
            "max_tokens": 250,
            "top_p": 0.9
        }
        
        print(f"Calling GitHub Models API with token: {GITHUB_TOKEN[:10]}...")
        response = requests.post(f"{ENDPOINT}/chat/completions", headers=headers, json=data, timeout=30)
        
        print(f"API Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            ai_response = result["choices"][0]["message"]["content"]
            print(f"AI Response received: {ai_response[:100]}...")
            return ai_response
        else:
            print(f"API Error {response.status_code}: {response.text}")
            return generate_fallback_response(query, context_text)
            
    except requests.exceptions.Timeout:
        print("API timeout, using fallback")
        return generate_fallback_response(query, context_text)
    except requests.exceptions.ConnectionError:
        print("Connection error, using fallback")
        return generate_fallback_response(query, context_text)
    except Exception as e:
        print(f"API call failed: {str(e)}")
        return generate_fallback_response(query, context_text)

# Routes
@app.route('/')
def home():
    return jsonify({
        "message": "NLP servis je aktivan!",
        "endpoints": ["/search", "/status"]
    })

@app.route('/status')
def status():
    return jsonify({
        "status": "active",
        "service": "NLP Chat Service",
        "version": "1.0"
    })

@app.route('/debug')
def debug():
    return jsonify({
        "current_directory": os.getcwd(),
        "files_in_directory": os.listdir('.'),
        "knowledge_base_length": len(KNOWLEDGE_BASE),
        "knowledge_base_preview": KNOWLEDGE_BASE[:200] + "..." if len(KNOWLEDGE_BASE) > 200 else KNOWLEDGE_BASE
    })

@app.route('/search', methods=['POST'])
def search():
    try:
        data = request.get_json()
        
        if not data or 'word' not in data:
            return jsonify({'error': 'Nedostaje parametar "word"'}), 400
        
        query = data['word'].strip()
        
        if not query:
            return jsonify({'error': 'Upit ne može biti prazan'}), 400
        
        # Search for relevant content
        relevant_content = search_relevant_content(query, KNOWLEDGE_BASE)
        
        if not relevant_content:
            return jsonify({
                'response': 'Nisam pronašao relevantne informacije o vašem pitanju.',
                'context_used': [],
                'query': query
            })
        
        # Generate AI response
        ai_response = generate_mistral_response(query, relevant_content)
        
        return jsonify({
            'response': ai_response,
            'context_used': relevant_content,
            'query': query
        })
        
    except Exception as e:
        return jsonify({'error': f'Greška u obradi zahteva: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
