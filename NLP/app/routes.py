from flask import Blueprint, request, jsonify
from app.services import generate_response_with_context
from app.nlp_utils import load_text_file, search_in_text

# Kreiranje Blueprint-a za rute
main_bp = Blueprint('main', __name__)

# Učitaj tekstualni sadržaj jednom prilikom pokretanja aplikacije
try:
    raw_text = load_text_file('fakultetski_sadržaj.txt')
    print("✅ Uspešno učitan fakultetski sadržaj")
except Exception as e:
    print(f"❌ Greška pri učitavanju: {e}")
    raw_text = ""

@main_bp.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get('word', '').strip()  
    
    if not query:
        return jsonify({'error': 'Pitanje je obavezno!'}), 400

    try:
        # Pretraži relevantne delove teksta
        relevant_parts = search_in_text(raw_text, query)
        
        if relevant_parts:
            # Kombinuj najrelevantnije delove kao kontekst
            context = "\n\n".join(relevant_parts[:3])
            
            # Generiši odgovor sa kontekstom
            ai_response = generate_response_with_context(query, context)
            
            return jsonify({
                'response': ai_response,
                'context_used': relevant_parts[:3],
                'query': query
            })
        else:
            # Ako nema rezultata, vrati poruku
            return jsonify({
                'response': 'Izvinjavam se, ali ne mogu da pronađem relevantne informacije o vašem pitanju u mojoj bazi znanja o IPI Akademiji.',
                'context_used': [],
                'query': query
            })
                
    except Exception as e:
        return jsonify({'error': f'Greška pri obradi zahteva: {str(e)}'}), 500

@main_bp.route('/status', methods=['GET'])
def status():
    return jsonify({
        'status': True,
        'message': 'IPI Akademija NLP servis je aktivan!',
        'knowledge_base_loaded': len(raw_text) > 0
    })

@main_bp.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Dobrodošli u IPI Akademija AI Chatbot API!',
        'endpoints': {
            '/search': 'POST - Pošaljite pitanje i dobijte odgovor',
            '/status': 'GET - Proverite status servisa'
        }
    })
