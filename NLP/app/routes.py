from flask import Blueprint, request, jsonify
from app.services import find_sentence_with_keywords, generate_response
from app.nlp_utils import load_text_file, process_text

# Kreiranje Blueprint-a za rute
bp = Blueprint('routes', __name__)

# Učitaj i procesiraj tekst jednom prilikom pokretanja aplikacije
raw_text = load_text_file('fakultetski_sadržaj.txt')
doc = process_text(raw_text)

@bp.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get('word', '').strip()  
    
    if not query:
        return jsonify({'error': 'Riječ ili fraza je obavezna!'}), 400

    sentence = find_sentence_with_keywords(doc, query) 
    if sentence:
        processed_text = generate_response(f'Na osnovu sljedećeg upita: {sentence}, odgovori mi na sljedeće pitanje: {query}')
        return jsonify({'sentence': processed_text})
    else:
        return jsonify({'message': f"Nije pronađena odgovarajuća rečenica za upit '{query}'."})
