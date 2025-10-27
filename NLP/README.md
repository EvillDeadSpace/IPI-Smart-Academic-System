# 🤖 IPI Smart Academic System - NLP Service

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000?logo=flask)](https://flask.palletsprojects.com/)
[![Mistral AI](https://img.shields.io/badge/Mistral_AI-LLM-FF6B6B)](https://mistral.ai/)

Flask-based NLP microservice za akademski chatbot sa Mistral AI integracijom i knowledge base search.

## ✨ Features

- 🧠 **Mistral AI Integration** - LLM-powered responses via GitHub Models API
- 📚 **Knowledge Base** - Keyword search preko akademskog sadržaja
- 💬 **Conversational AI** - Context-aware odgovori na studentska pitanja
- 🔍 **Hybrid Search** - Keyword matching + AI generation
- ⚡ **Fast Responses** - Optimized text retrieval i generation
- 🌐 **CORS Enabled** - Ready for frontend integration

## 🛠️ Tech Stack

| Component       | Technology                 |
| --------------- | -------------------------- |
| **Framework**   | Flask 3.1.0                |
| **Language**    | Python 3.10+               |
| **AI Model**    | Mistral AI (GitHub Models) |
| **HTTP Client** | Requests                   |
| **Deployment**  | PythonAnywhere             |

## 📦 Installation

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## ⚙️ Configuration

Create `.env` file:

```env
# Mistral AI via GitHub Models
GITHUB_TOKEN=your_github_personal_access_token_here

# Alternative Mistral API keys (optional)
OPEN_API_KEY_MISTRAL=your_mistral_api_key
OPEN_API_KEY_OPENAI=your_openai_key_for_embeddings

# Flask settings
FLASK_ENV=development
FLASK_DEBUG=True
```

### Getting GitHub Token

1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `read:packages`
4. Copy token to `.env`

## 🚀 Running the Service

```bash
# Development mode
python main.py
# → http://localhost:5000

# Production mode
gunicorn -w 4 -b 0.0.0.0:5000 main:app
```

## 📁 Project Structure

```
NLP/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── routes.py            # API endpoints
│   ├── services.py          # Business logic (search, AI)
│   └── nlp_utils.py         # NLP utilities
│
├── fakultetski_sadržaj.txt  # Knowledge base
├── main.py                  # Entry point
├── requirements.txt         # Python dependencies
│
├── flask_app_mistral_direct.py   # Alternative implementations
├── flask_app_unified.py
├── simple_chatbot.py
└── vector_rag_system.py     # RAG implementation (WIP)
```

## 🌐 API Endpoints

### Health Check

```bash
GET /status
```

**Response:**

```json
{
  "status": "running",
  "message": "NLP service is active",
  "timestamp": "2024-10-27T12:34:56Z"
}
```

### Search (Chat)

```bash
POST /search
Content-Type: application/json

{
  "word": "Koliko ECTS bodova ima predmet Matematika 1?"
}
```

**Response:**

```json
{
  "response": "Predmet Matematika 1 nosi 6 ECTS bodova i izvodi se u prvom semestru.",
  "context_used": [
    "Matematika 1 - 6 ECTS - Semestar 1",
    "Obavezni predmet na svim smerovima"
  ],
  "query": "Koliko ECTS bodova ima predmet Matematika 1?"
}
```

### Python Usage

```python
import requests

# Search query
response = requests.post('http://localhost:5000/search', json={
    'word': 'Šta je potrebno za upis fakulteta?'
})

data = response.json()
print(data['response'])
```

## 🧠 How It Works

### 1. Knowledge Base Loading

**fakultetski_sadržaj.txt:**

```text
# IPI Akademija - Informacije

## Predmeti

Matematika 1
- ECTS: 6
- Semestar: 1
- Tip: Obavezni

Programiranje 1
- ECTS: 8
- Semestar: 1
- Profesor: Dr. Marko Marković
```

**services.py:**

```python
def load_knowledge_base(file_path: str) -> str:
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

KNOWLEDGE_BASE = load_knowledge_base('fakultetski_sadržaj.txt')
```

### 2. Keyword Search

```python
def search_content(query: str, content: str) -> List[str]:
    keywords = query.lower().split()
    lines = content.split('\n')

    relevant_lines = []
    for i, line in enumerate(lines):
        if any(keyword in line.lower() for keyword in keywords):
            # Include context (3 lines before/after)
            context = lines[max(0, i-3):min(len(lines), i+4)]
            relevant_lines.extend(context)

    return list(set(relevant_lines))
```

### 3. AI Response Generation

```python
def generate_response(query: str, context: str) -> str:
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "messages": [
            {
                "role": "system",
                "content": "Ti si AI asistent za IPI Akademiju. Odgovaraj na srpskom jeziku."
            },
            {
                "role": "user",
                "content": f"Kontekst:\n{context}\n\nPitanje: {query}"
            }
        ],
        "model": "Mistral-large",
        "temperature": 0.7,
        "max_tokens": 500
    }

    response = requests.post(
        "https://models.inference.ai.azure.com/chat/completions",
        headers=headers,
        json=payload
    )

    return response.json()['choices'][0]['message']['content']
```

### 4. Complete Flow

```python
@app.route('/search', methods=['POST'])
def search():
    query = request.json.get('word', '')

    # 1. Search knowledge base
    context_lines = search_content(query, KNOWLEDGE_BASE)
    context = '\n'.join(context_lines)

    # 2. Generate AI response
    if context:
        response = generate_response(query, context)
    else:
        response = "Nisam pronašao relevantne informacije u bazi znanja."

    return jsonify({
        'response': response,
        'context_used': context_lines,
        'query': query
    })
```

## 📚 Knowledge Base Format

### Structure

```markdown
# Section Title

## Subsection

Key: Value

- Bullet point
- Another point

Description text here.
```

### Example Entry

```markdown
## Predmet: Programiranje 1

ECTS: 8
Semestar: 1
Profesor: Dr. Marko Marković
Tip: Obavezni

Opis:
Uvod u programiranje sa Python jezikom. Studenti uče osnovne koncepte:

- Varijable i tipovi podataka
- Kontrolne strukture
- Funkcije i moduli
- Rad sa fajlovima
```

### Best Practices

1. **Konzistentna struktura** - Use heading hierarchy
2. **Ključne reči** - Include search-friendly terms
3. **Kratki pasusi** - 3-5 lines max per paragraph
4. **Konkretni odgovori** - Direct answers to common questions

## ☁️ Deployment (PythonAnywhere)

### Setup Steps

1. **Upload code**

```bash
# Via Git
git clone https://github.com/your-repo/IPI-Smart-Academic-System.git
cd IPI-Smart-Academic-System/NLP
```

2. **Create virtual environment**

```bash
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **Configure WSGI**

**wsgi.py:**

```python
import sys
import os

# Add project directory to path
project_home = '/home/username/IPI-Smart-Academic-System/NLP'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Load environment variables
from dotenv import load_dotenv
load_dotenv(os.path.join(project_home, '.env'))

# Import Flask app
from main import app as application
```

4. **Set environment variables**

- Go to Web tab → Environment Variables
- Add `GITHUB_TOKEN`, `OPEN_API_KEY_MISTRAL`

5. **Reload web app**

### Production URL

**Endpoint:** https://amartubic.pythonanywhere.com/search

**Test:**

```bash
curl -X POST https://amartubic.pythonanywhere.com/search \
  -H "Content-Type: application/json" \
  -d '{"word": "Koji predmeti su obavezni?"}'
```

## 🧪 Testing

### Local Testing

```bash
# Test health endpoint
curl http://localhost:5000/status

# Test search
curl -X POST http://localhost:5000/search \
  -H "Content-Type: application/json" \
  -d '{"word": "matematika ECTS"}'
```

### Python Test Script

```python
# test_nlp.py
import requests

BASE_URL = "http://localhost:5000"

def test_health():
    response = requests.get(f"{BASE_URL}/status")
    assert response.status_code == 200
    print("✓ Health check passed")

def test_search():
    response = requests.post(f"{BASE_URL}/search", json={
        "word": "Koliko traje studij?"
    })
    assert response.status_code == 200
    assert 'response' in response.json()
    print("✓ Search test passed")

if __name__ == "__main__":
    test_health()
    test_search()
```

## 🔍 Troubleshooting

### "Module not found" errors

```bash
pip install -r requirements.txt
# Ensure virtual environment is activated
```

### Mistral API errors

- Check `GITHUB_TOKEN` is valid (not expired)
- Verify token has `read:packages` scope
- Test with: `curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user`

### Empty responses

- Check `fakultetski_sadržaj.txt` exists and has content
- Verify file encoding is UTF-8
- Test keyword search independently

### CORS errors (frontend integration)

```python
# Ensure CORS is enabled in app/__init__.py
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
```

## 📊 Performance Optimization

### Caching Responses

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def search_content_cached(query: str) -> List[str]:
    return search_content(query, KNOWLEDGE_BASE)
```

### Async Processing

```python
import asyncio
import aiohttp

async def generate_response_async(query: str, context: str):
    async with aiohttp.ClientSession() as session:
        async with session.post(API_URL, json=payload) as resp:
            return await resp.json()
```

## 🚀 Future Enhancements

- [ ] **Vector RAG** - Implement semantic search sa embeddings
- [ ] **Conversation Memory** - Track multi-turn dialogs
- [ ] **Response Caching** - Redis cache za često korišćene upite
- [ ] **Analytics** - Log queries for knowledge base improvement
- [ ] **Multi-language** - Support English alongside Bosninan

## 📚 Dependencies

```txt
Flask==3.1.0
flask-cors==5.0.0
requests==2.32.3
python-dotenv==1.0.1
gunicorn==23.0.0  # Production server
```

## 🤝 Contributing

1. Test changes with multiple query types
2. Update `fakultetski_sadržaj.txt` if adding domains
3. Maintain Serbian language responses
4. Document new endpoints in this README

## 📄 License

See [main README](../README.md) for license information.

---

**Production API:** https://amartubic.pythonanywhere.com
