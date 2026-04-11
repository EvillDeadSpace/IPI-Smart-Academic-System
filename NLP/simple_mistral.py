import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Mistral API Configuration (direktno)
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY") or "UUfpEdF9FtWWCvh5yrw1vUpmlIOGWLGX"
MISTRAL_ENDPOINT = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_MODEL = "mistral-small"

print(f"✅ Mistral API key: {MISTRAL_API_KEY[:10]}...")
print(f"🎯 Model: {MISTRAL_MODEL}")
print(f"🔗 Endpoint: {MISTRAL_ENDPOINT}")


def load_knowledge_base():
    """Učitaj fakultetski sadržaj"""
    try:
        possible_paths = [
            "fakultetski_sadržaj.txt",
            "./fakultetski_sadržaj.txt",
            "/home/amartubic/mysite/fakultetski_sadržaj.txt",
            os.path.join(os.path.dirname(__file__), "fakultetski_sadržaj.txt"),
        ]

        for file_path in possible_paths:
            if os.path.exists(file_path):
                with open(file_path, encoding="utf-8") as file:
                    content = file.read()
                    print(f"✅ Fajl učitan iz {file_path}, dužina: {len(content)}")
                    return content

        print(f"❌ Fajl nije pronađen u: {possible_paths}")
        return "Fajl fakultetski_sadržaj.txt nije pronađen."

    except Exception as e:
        print(f"❌ Greška pri učitavanju: {e}")
        return f"Greška pri učitavanju fajla: {str(e)}"


KNOWLEDGE_BASE = load_knowledge_base()


# Simple keyword search (without sklearn)
def simple_search(query, knowledge_base, max_results=3):
    """Jednostavna pretraga ključnih reči"""
    if not query or not knowledge_base:
        return []

    # Normalizacija srpskih slova
    def normalize_serbian(text):
        replacements = {
            "č": "c",
            "ć": "c",
            "đ": "d",
            "š": "s",
            "ž": "z",
            "Č": "C",
            "Ć": "C",
            "Đ": "D",
            "Š": "S",
            "Ž": "Z",
        }
        for sr, en in replacements.items():
            text = text.replace(sr, en)
        return text

    chunks = knowledge_base.split("\n\n")
    chunks = [chunk.strip() for chunk in chunks if chunk.strip()]

    query_words = query.lower().split()

    # Normalizuj query riječi
    normalized_query_words = [normalize_serbian(word) for word in query_words]
    query_words.extend(normalized_query_words)  # Dodaj i normalizovane verzije

    results = []

    # Posebno traženje za "cijena"
    if any(word in ["cijena", "cena", "fakulteta", "faksa"] for word in query_words):
        query_words.extend(["2500km", "2500", "km", "cijena"])

    # Posebno traženje za "osnivač/osnivac"
    if any(word in ["osnivač", "osnivac", "tvorac"] for word in query_words):
        query_words.extend(["amar", "tubic", "osnivac", "tvorac", "stranica"])

    for chunk in chunks:
        chunk_lower = chunk.lower()
        chunk_normalized = normalize_serbian(chunk_lower)
        score = 0

        # Jednostavan scoring na osnovu broja pronađenih reči
        for word in query_words:
            # Traži u originalnom i normalizovanom tekstu
            if word in chunk_lower or word in chunk_normalized:
                score += chunk_lower.count(word) + chunk_normalized.count(word)

        # Bonus score za cijena fakulteta
        if "cijena" in chunk_lower and ("fakulteta" in chunk_lower or "2500" in chunk_lower):
            score += 10

        # Bonus score za osnivač
        if any(word in chunk_normalized for word in ["osnivac", "amar", "tubic"]):
            score += 10

        if score > 0:
            results.append({"content": chunk, "score": score})

    # Sortiraj po score-u
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:max_results]


# Generate AI response using direct Mistral API
def generate_mistral_response(query, context):
    context_text = "\n\n".join([item["content"] for item in context])

    # Smart fallback function
    def generate_fallback_response(query, context_text):
        if not context_text:
            return "Nisam pronašao informacije o vašem pitanju."

        lines = context_text.split("\n")
        filtered_lines = [
            line.strip() for line in lines if line.strip() and not line.startswith("#")
        ]

        query_lower = query.lower()

        # Lokacija
        if any(word in query_lower for word in ["lokacija", "adresa", "gdje", "gde", "nalazi"]):
            location_info = [
                line
                for line in filtered_lines
                if any(word in line.lower() for word in ["zmaja", "bosne", "tuzla", "adresa"])
            ]
            if location_info:
                return f"Naša lokacija je {location_info[0].replace('- ', '')}."

        # Cijena/košta fakulteta
        if any(
            word in query_lower
            for word in [
                "cijena",
                "cena",
                "košta",
                "kosta",
                "uplata",
                "novac",
                "faksa",
                "fakulteta",
                "studija",
            ]
        ):
            price_info = [
                line
                for line in filtered_lines
                if any(
                    word in line.lower()
                    for word in ["cijena fakulteta", "2500km", "km", "bam", "novac", "besplatno"]
                )
            ]
            if price_info:
                return f"Cijena studija na IPI Akademiji: {price_info[0].replace('- ', '').replace('##', '').strip()}"

        # Programi
        if any(word in query_lower for word in ["program", "studij", "smer", "smjer"]):
            program_info = [
                line
                for line in filtered_lines
                if any(
                    word in line.lower()
                    for word in ["program", "studij", "informatika", "ekonomija"]
                )
            ]
            if program_info:
                programs = "\n".join([f"• {prog.replace('- ', '')}" for prog in program_info[:4]])
                return f"IPI Akademija nudi sledeće studijske programe:\n\n{programs}"

        if filtered_lines:
            return filtered_lines[0].replace("- ", "").strip()

        return "Na osnovu dostupnih informacija, možete kontaktirati IPI Akademiju za detalje."

    # Try direct Mistral API
    try:
        # Ako nema konteksta, vrati odmah fallback
        if not context_text or len(context_text.strip()) < 10:
            return "Nisam pronašao relevantne informacije u bazi podataka o IPI Akademiji za vaše pitanje."

        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json",
        }

        prompt = f"""Ti si asistent za IPI Akademiju. Imaš pristup samo ovim informacijama:

{context_text}

Pitanje: {query}

STRIKTNA PRAVILA:
- Odgovori SAMO na osnovu gornjih informacija
- Ako informacija nema u tekstu, reci: "Nema te informacije u našoj bazi podataka"
- NE dodavaj ništa što nije eksplicitno napisano
- NE izmišljaj brojeve, datume, adrese ili bilo koje detalje
- Odgovori kratko na bosanskom jeziku"""

        data = {
            "model": MISTRAL_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": "Ti si STRIKTNI AI asistent za IPI Akademiju. Odgovaraš SAMO na osnovu datog teksta. Ako nema informacije, kažeš da nema podataka. ZABRANJEN je bilo kakav izmišljeni sadržaj!",
                },
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.1,
            "max_tokens": 150,
        }

        print("🔄 Pozivam direktan Mistral API...")
        response = requests.post(MISTRAL_ENDPOINT, headers=headers, json=data, timeout=30)

        print(f"📊 Mistral API Status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            ai_response = result["choices"][0]["message"]["content"]
            print(f"✅ Mistral odgovor: {ai_response[:100]}...")
            return ai_response
        else:
            print(f"❌ Mistral API Error {response.status_code}: {response.text}")
            return generate_fallback_response(query, context_text)

    except Exception as e:
        print(f"❌ Mistral API greška: {str(e)}")
        return generate_fallback_response(query, context_text)


# Routes
@app.route("/")
def home():
    return jsonify(
        {
            "message": "NLP servis sa direktnim Mistral API-jem (simple version)!",
            "endpoints": ["/search", "/test-mistral", "/status"],
        }
    )


@app.route("/status")
def status():
    return jsonify(
        {
            "status": "active",
            "service": "NLP Chat Service with Direct Mistral API",
            "version": "2.0",
            "mistral_api": "connected" if MISTRAL_API_KEY else "not configured",
            "knowledge_base_loaded": len(KNOWLEDGE_BASE) > 100,
        }
    )


@app.route("/test-mistral")
def test_mistral():
    """Test direktnog Mistral API-ja"""
    try:
        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json",
        }

        data = {
            "model": MISTRAL_MODEL,
            "messages": [{"role": "user", "content": "Reci zdravo na Bosanskom jeziku."}],
            "temperature": 0.3,
            "max_tokens": 50,
        }

        print(f"🔄 Testiram Mistral API: {MISTRAL_ENDPOINT}")
        response = requests.post(MISTRAL_ENDPOINT, headers=headers, json=data, timeout=30)

        return jsonify(
            {
                "status_code": response.status_code,
                "response_text": response.text,
                "endpoint": MISTRAL_ENDPOINT,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e), "error_type": type(e).__name__})


@app.route("/search", methods=["POST"])
def search():
    try:
        data = request.json
        query = data.get("word", "")

        if not query:
            return jsonify({"error": "Query parameter 'word' is required"})

        print(f"🔍 Pretraga za: {query}")

        # DEBUG: Provjeri da li uopšte postoji "cijena" u knowledge base
        if "cijena" in query.lower():
            print("📋 DEBUG: Tražim 'cijena' u knowledge base...")
            if "cijena" in KNOWLEDGE_BASE.lower():
                print("✅ 'cijena' POSTOJI u knowledge base!")
                # Pronađi liniju sa cijenom
                lines = KNOWLEDGE_BASE.split("\n")
                price_lines = [line for line in lines if "cijena" in line.lower()]
                print(f"📄 Linije sa 'cijena': {price_lines}")
            else:
                print("❌ 'cijena' NE POSTOJI u knowledge base!")

        # Simple search
        context = simple_search(query, KNOWLEDGE_BASE)
        print(f"📄 Pronađeno {len(context)} relevantnih rezultata")

        # DEBUG: Isprintaj context
        if context:
            print("🔍 Kontekst koji se šalje AI-ju:")
            for i, ctx in enumerate(context):
                print(f"  {i + 1}. {ctx['content'][:100]}... (score: {ctx['score']})")
        else:
            print(f"❌ NEMA konteksta za '{query}'!")

        # Generate response
        response = generate_mistral_response(query, context)

        return jsonify({"query": query, "response": response, "context_used": context})

    except Exception as e:
        print(f"❌ Greška u /search: {str(e)}")
        return jsonify({"error": f"Greška u pretraži: {str(e)}"})


if __name__ == "__main__":
    print("🚀 Pokretanje NLP servisa...")
    app.run(host="0.0.0.0", port=5001, debug=False)
