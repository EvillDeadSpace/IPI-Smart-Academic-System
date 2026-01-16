from flask import Blueprint, request, jsonify, send_file, Response
from typing import Tuple, Optional

from app.services import generate_response_with_rag
from app.nlp_utils import load_text_file, search_in_text

from notification_service.main import function_send_notification
from document_service.main import generate_health_pdf
import json
from s3_bucket.main import upload_file, get_all_files_s3

from s3_bucket.main import get_file_stream
import io
import mimetypes

# Create Flask Blueprint for main routes
main_bp: Blueprint = Blueprint("main", __name__)

# Load text content once at application startup (fallback for non-RAG mode)
raw_text: str
try:
    raw_text = load_text_file("fakultetski_sadržaj.txt")
    print("✅ Successfully loaded academic content")
except Exception as e:
    print(f"❌ Error loading content: {e}")
    raw_text = ""

# Initialize RAG (Retrieval-Augmented Generation) system
import os

rag_system = None
use_rag = os.getenv("USE_RAG", "true").lower() == "true"

if use_rag:
    try:
        from rag_system import RAGSystem

        rag_system = RAGSystem()
        print("✅ RAG system successfully initialized!")
    except Exception as e:
        print(f"⚠️  RAG system not available: {e}")
        print("📝 Falling back to keyword-based search")
else:
    print("⚠️  RAG system disabled via USE_RAG=false")
    print("📝 Using keyword-based search")


@main_bp.route("/search", methods=["POST"])
def search() -> Tuple[Response, int]:
    """
    Search endpoint for generating AI responses to user queries.
    Uses RAG system with vector search if available, otherwise falls back to keyword search.
    """
    data = request.get_json()
    query = data.get("word", "").strip()

    if not query:
        return jsonify({"error": "Pitanje je obavezno!"}), 400

    try:
        # Try using RAG system if available
        if rag_system:
            # RAG approach - retrieve relevant context using vector search
            context = rag_system.get_context_for_llm(query, n_results=3)

            # Generate AI response with RAG context
            ai_response = generate_response_with_rag(query, context)

            return jsonify(
                {
                    "response": ai_response,
                    "method": "RAG (Vector Search)",
                    "query": query,
                    "context_length": len(context),
                }
            )
        else:
            # Fallback to keyword-based search
            relevant_parts = search_in_text(raw_text, query)

            if relevant_parts:
                # Combine most relevant parts as context
                context = "\n\n".join(relevant_parts[:3])

                # Generate AI response with keyword search context
                ai_response = generate_response_with_rag(query, context)

                return jsonify(
                    {
                        "response": ai_response,
                        "method": "Keyword Search (Fallback)",
                        "context_used": relevant_parts[:3],
                        "query": query,
                    }
                )
            else:
                # No relevant results found
                return jsonify(
                    {
                        "response": "Izvinjavam se, ali ne mogu da pronađem relevantne informacije o vašem pitanju u mojoj bazi znanja o IPI Akademiji. 🤔\n\nMožete me pitati o:\n- Studijskim programima\n- Ceni studija\n- Lokaciji fakulteta\n- Profesorima i osoblju\n- Studentskim aktivnostima",
                        "method": "No results",
                        "context_used": [],
                        "query": query,
                    }
                )

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"error": f"Greška pri obradi zahteva: {str(e)}"}), 500


@main_bp.route("/status", methods=["GET"])
def status() -> Response:
    """Check service status and component availability"""
    return jsonify(
        {
            "status": True,
            "message": "IPI Akademija NLP servis je aktivan!",
            "rag_enabled": rag_system is not None,
            "knowledge_base_loaded": len(raw_text) > 0,
            "features": {
                "vector_search": rag_system is not None,
                "mistral_ai": True,
                "multilingual_support": True,
            },
        }
    )


@main_bp.route("/", methods=["GET"])
def home() -> Response:
    """Basic API information and usage guide"""
    return jsonify(
        {
            "message": "Dobrodošli u IPI Akademija AI Chatbot API! 🎓",
            "version": "2.0 - RAG Edition",
            "endpoints": {
                "/search": "POST - Pošaljite pitanje i dobijte odgovor",
                "/status": "GET - Proverite status servisa",
                "/health-certificate": "POST - Generiši potvrdu o zdravstvenom osiguranju",
                "/notification-services": "POST - Pretplatite se na obaveštenja",
            },
            "example": {
                "url": "/search",
                "method": "POST",
                "body": {"word": "Koje studijske programe nudi IPI Akademija?"},
            },
        }
    )


@main_bp.route("/health-certificate", methods=["POST"])
def healthCertificate() -> Response:
    """
    Generate health certificate PDF for students.
    Required fields: fullName, jmbg, city, dateOfBirth, yearsOfStudy, academicYear
    """
    print("Health certificate requested")
    data: dict = request.get_json(silent=True) or {}

    # Generate PDF with student information
    pdf_buf = generate_health_pdf(
        full_name=data["fullName"],
        jmbg=data["jmbg"],
        city=data["city"],
        date_of_birth=data["dateOfBirth"],
        years_of_study=data["yearsOfStudy"],
        academic_year=data["academicYear"],
        search_text="Potvrđuje se da je ",
    )

    # Return PDF as downloadable file
    return send_file(
        pdf_buf,
        mimetype="application/pdf",
        as_attachment=True,  # Set to False for inline display
        attachment_filename="health_certificate.pdf",
    )


@main_bp.route("/notification-services", methods=["POST"])
def notificationServices() -> Tuple[Response, int]:
    """
    Handle notification service subscription requests.
    Expects JSON with 'email' field.
    """
    print("Notification service get new request!")

    data: Optional[dict] = request.json
    print(f"Received data:")
    print(json.dumps(data, indent=2, ensure_ascii=False))

    if not data:
        print("❌ ERROR: No data provided in request")
        return jsonify({"error": "No data provided"}), 400

    print("\n🚀 Calling function_send_notification...")
    # Function to connect notification service
    result = function_send_notification(data)

    if result:
        print("✅ Notification sent successfully!")
    else:
        print("❌ Error sending notification")

    print("=" * 60 + "\n")

    return (
        jsonify({"success": result, "message": "Notification processed", "data": data}),
        200,
    )


@main_bp.route("/save_s3", methods=["POST"])
def save_s3() -> Tuple[Response, int]:
    print("Health certificate requested")

    # Read all files and metadata from the request
    file = request.files.get("file")
    professor_subject = request.form.get("professor_subject")
    assignment = request.form.get("assignment")

    print(
        f"Received file: {file}"
        f", professor_subject: {professor_subject}"
        f", assignment: {assignment}"
    )
    # Validate inputs
    if not file:
        return jsonify({"error": "No file provided"}), 400

    if not professor_subject or not assignment:
        return jsonify({"error": "Missing metadata"}), 400

    # Upload file to S3 bucket
    upload_file(professor_subject, assignment, file_to_save=file)

    return jsonify({"message": "Success send file to s3"}), 200


@main_bp.route("/get_all_file_s3", methods=["POST"])
def get_file_s3() -> Tuple[Response, int]:
    data = request.get_json()

    if not data or "subject" not in data:
        return jsonify({"error": "problem with payload need professor subject"}), 400

    professor_subject = data["subject"]
    subject = get_all_files_s3(professor_subject)

    return (
        jsonify({"message": "Success get file from s3", "professor_subject": subject}),
        200,
    )


@main_bp.route("/get_file_from_s3", methods=["GET"])
def get_file() -> Tuple[Response, int]:
    """Download a file from S3 and stream it directly to the user's browser."""
    folder_name = request.args.get("folder_name")
    file_name = request.args.get("file_name")

    if not folder_name or not file_name:
        return jsonify({"error": "Missing folder_name or file_name parameter"}), 400

    try:

        # Get file data from S3
        file_data = get_file_stream(folder_name, file_name)

        # Create BytesIO object for send_file
        file_buffer = io.BytesIO(file_data)
        file_buffer.seek(0)

        # Guess MIME type
        mime_type, _ = mimetypes.guess_type(file_name)

        response = send_file(
            file_buffer,
            mimetype=mime_type or "application/octet-stream",
            as_attachment=True,
            download_name=file_name,  # type: ignore
        )
        return response, 200
    except Exception as e:
        print(f"❌ Error in /get_file_from_s3: {e}")
        return jsonify({"error": str(e)}), 500
