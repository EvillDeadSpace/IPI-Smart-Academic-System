from flask import Blueprint, request, jsonify, send_file
from app.services import generate_response_with_rag
from app.nlp_utils import load_text_file, search_in_text
from notification_service.main import function_send_notification
from document_service.main import generate_health_pdf
import json

# Create Flask Blueprint for main routes
main_bp = Blueprint('main', __name__)

# Load text content once at application startup (fallback for non-RAG mode)
try:
    raw_text = load_text_file('fakultetski_sadržaj.txt')
    print("✅ Successfully loaded academic content")
except Exception as e:
    print(f"❌ Error loading content: {e}")
    raw_text = ""

# Initialize RAG (Retrieval-Augmented Generation) system
rag_system = None
try:
    from rag_system import RAGSystem
    rag_system = RAGSystem()
    print("✅ RAG system successfully initialized!")
except Exception as e:
    print(f"⚠️  RAG system not available: {e}")
    print("📝 Falling back to keyword-based search")

@main_bp.route('/search', methods=['POST'])
def search():
    """
    Search endpoint for generating AI responses to user queries.
    Uses RAG system with vector search if available, otherwise falls back to keyword search.
    """
    data = request.get_json()
    query = data.get('word', '').strip()  
    
    if not query:
        return jsonify({'error': 'Pitanje je obavezno!'}), 400

    try:
        # Try using RAG system if available
        if rag_system:
            # RAG approach - retrieve relevant context using vector search
            context = rag_system.get_context_for_llm(query, n_results=3)
            
            # Generate AI response with RAG context
            ai_response = generate_response_with_rag(query, context)
            
            return jsonify({
                'response': ai_response,
                'method': 'RAG (Vector Search)',
                'query': query,
                'context_length': len(context)
            })
        else:
            # Fallback to keyword-based search
            relevant_parts = search_in_text(raw_text, query)
            
            if relevant_parts:
                # Combine most relevant parts as context
                context = "\n\n".join(relevant_parts[:3])
                
                # Generate AI response with keyword search context
                ai_response = generate_response_with_rag(query, context)
                
                return jsonify({
                    'response': ai_response,
                    'method': 'Keyword Search (Fallback)',
                    'context_used': relevant_parts[:3],
                    'query': query
                })
            else:
                # No relevant results found
                return jsonify({
                    'response': 'Izvinjavam se, ali ne mogu da pronađem relevantne informacije o vašem pitanju u mojoj bazi znanja o IPI Akademiji. 🤔\n\nMožete me pitati o:\n- Studijskim programima\n- Ceni studija\n- Lokaciji fakulteta\n- Profesorima i osoblju\n- Studentskim aktivnostima',
                    'method': 'No results',
                    'context_used': [],
                    'query': query
                })
                
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'error': f'Greška pri obradi zahteva: {str(e)}'}), 500

@main_bp.route('/status', methods=['GET'])
def status():
    """Check service status and component availability"""
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
    """Basic API information and usage guide"""
    return jsonify({
        'message': 'Dobrodošli u IPI Akademija AI Chatbot API! 🎓',
        'version': '2.0 - RAG Edition',
        'endpoints': {
            '/search': 'POST - Pošaljite pitanje i dobijte odgovor',
            '/status': 'GET - Proverite status servisa',
            '/health-certificate': 'POST - Generiši potvrdu o zdravstvenom osiguranju',
            '/notification-services': 'POST - Pretplatite se na obaveštenja'
        },
        'example': {
            'url': '/search',
            'method': 'POST',
            'body': {'word': 'Koje studijske programe nudi IPI Akademija?'}
        }
    })

@main_bp.route('/health-certificate', methods=['POST'])
def healthCertificate():
    """
    Generate health certificate PDF for students.
    Required fields: fullName, jmbg, city, dateOfBirth, yearsOfStudy, academicYear
    """
    print("Health certificate requested")
    data = request.get_json(silent=True) or {}

    # Generate PDF with student information
    pdf_buf = generate_health_pdf(
        full_name      = data["fullName"],
        jmbg           = data["jmbg"],
        city           = data["city"],
        date_of_birth  = data["dateOfBirth"],
        years_of_study = data["yearsOfStudy"],
        academic_year  = data["academicYear"],
        search_text    = "Potvrđuje se da je "
    )

    # Return PDF as downloadable file
    return send_file(
        pdf_buf,
        mimetype="application/pdf",
        as_attachment=True,  # Set to False for inline display
        download_name="health_certificate.pdf",
        max_age=0
    )

@main_bp.route('/notification-services', methods=['POST'])
def notificationServices():
    """
    Handle notification service subscription requests.
    Expects JSON with 'email' field.
    """
    print("Notification service get new request!")
    
    data = request.json
    print(f"Received data:")
    print(json.dumps(data, indent=2, ensure_ascii=False))

    if not data:
        print("❌ ERROR: No data provided in request")
        return jsonify({'error': 'No data provided'}), 400
    
    print("\n🚀 Calling function_send_notification...")
    # Function to connect notification service
    result = function_send_notification(data)
    
    if result:
        print("✅ Notification sent successfully!")
    else:
        print("❌ Error sending notification")
    
    print("="*60 + "\n")
    
    return jsonify({
        'success': result,
        'message': 'Notification processed',
        'data': data
    }), 200
    
