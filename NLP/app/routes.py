from flask import Blueprint, request, jsonify, send_file
from app.services import generate_response_with_rag
from app.nlp_utils import load_text_file, search_in_text
# PDF generator adapter (loads from ../document-service/main.py)
from app.pdf_adapter import generate_health_pdf


# Kreiranje Blueprint-a za rute
main_bp = Blueprint('main', __name__)

# Učitaj tekstualni sadržaj jednom prilikom pokretanja aplikacije (fallback)
try:
    raw_text = load_text_file('fakultetski_sadržaj.txt')
    print("✅ Uspešno učitan fakultetski sadržaj")
except Exception as e:
    print(f"❌ Greška pri učitavanju: {e}")
    raw_text = ""

# Inicijalizuj RAG sistem
rag_system = None
try:
    from rag_system import RAGSystem
    rag_system = RAGSystem()
    print("✅ RAG sistem uspešno inicijalizovan!")
except Exception as e:
    print(f"⚠️  RAG sistem nije dostupan: {e}")
    print("📝 Koristiću keyword-based pretraživanje kao fallback")

@main_bp.route('/search', methods=['POST'])
def search():
    """
    Endpoint za pretraživanje i generisanje odgovora
    Koristi RAG sistem ako je dostupan, inače keyword search
    """
    data = request.get_json()
    query = data.get('word', '').strip()  
    
    if not query:
        return jsonify({'error': 'Pitanje je obavezno!'}), 400

    try:
        # Pokušaj koristiti RAG sistem
        if rag_system:
            # RAG pristup - vector search
            context = rag_system.get_context_for_llm(query, n_results=3)
            
            # Generiši odgovor sa RAG kontekstom
            ai_response = generate_response_with_rag(query, context)
            
            return jsonify({
                'response': ai_response,
                'method': 'RAG (Vector Search)',
                'query': query,
                'context_length': len(context)
            })
        else:
            # Fallback - keyword search
            relevant_parts = search_in_text(raw_text, query)
            
            if relevant_parts:
                # Kombinuj najrelevantnije delove kao kontekst
                context = "\n\n".join(relevant_parts[:3])
                
                # Generiši odgovor sa kontekstom
                ai_response = generate_response_with_rag(query, context)
                
                return jsonify({
                    'response': ai_response,
                    'method': 'Keyword Search (Fallback)',
                    'context_used': relevant_parts[:3],
                    'query': query
                })
            else:
                # Ako nema rezultata, vrati poruku
                return jsonify({
                    'response': 'Izvinjavam se, ali ne mogu da pronađem relevantne informacije o vašem pitanju u mojoj bazi znanja o IPI Akademiji. 🤔\n\nMožete me pitati o:\n- Studijskim programima\n- Ceni studija\n- Lokaciji fakulteta\n- Profesorima i osoblju\n- Studentskim aktivnostima',
                    'method': 'No results',
                    'context_used': [],
                    'query': query
                })
                
    except Exception as e:
        print(f"❌ Greška: {e}")
        return jsonify({'error': f'Greška pri obradi zahteva: {str(e)}'}), 500

@main_bp.route('/status', methods=['GET'])
def status():
    """Proverava status servisa i dostupnost komponenti"""
    return jsonify({
        'status': True,
        'message': 'IPI Akademija NLP servis je aktivan!',
        'rag_enabled': rag_system is not None,
        'knowledge_base_loaded': len(raw_text) > 0,
        'features': {
            'vector_search': rag_system is not None,
            'mistral_ai': True,
            'multilingual_support': True
        }
    })

@main_bp.route('/', methods=['GET'])
def home():
    """Osnovne informacije o API-ju"""
    return jsonify({
        'message': 'Dobrodošli u IPI Akademija AI Chatbot API! 🎓',
        'version': '2.0 - RAG Edition',
        'endpoints': {
            '/search': 'POST - Pošaljite pitanje i dobijte odgovor',
            '/status': 'GET - Proverite status servisa'
        },
        'example': {
            'url': '/search',
            'method': 'POST',
            'body': {'word': 'Koje studijske programe nudi IPI Akademija?'}
        }
    })

@main_bp.route('/health-certificate', methods=['POST'])
# Get a maticniBroj, grad, date of birth, years of study, years
def healthCertificate():
    print("Health certificate requested")
    data = request.get_json(silent=True) or {} 
    required = ["fullName", "jmbg", "city", "dateOfBirth", "yearsOfStudy", "academicYear"]


    pdf_buf = generate_health_pdf(
        full_name      = data["fullName"],
        jmbg           = data["jmbg"],
        city           = data["city"],
        date_of_birth  = data["dateOfBirth"],
        years_of_study = data["yearsOfStudy"],
        academic_year  = data["academicYear"],
        search_text    = "Potvrđuje se da je "
    )

    return send_file(
        pdf_buf,
        mimetype="application/pdf",
        as_attachment=True,                 # stavi False za inline prikaz
        download_name="health_certificate.pdf",
        max_age=0
    )

@main_bp.route('/notification-services', methods=['POST'])
def notificationServices():
    """
    Endpoint for handling notification service requests
    Receives email and processes notification subscription
    """
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    # Log the email for debugging
    print(f"Notification service request for email: {email}")
    
    # TODO: Add actual notification service logic here
    # (e.g., subscribe to mailing list, send confirmation email, etc.)
    
    return jsonify({
        'success': True,
        'message': 'Notification service request received',
        'email': email
    }), 200
    
