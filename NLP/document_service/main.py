import io
import os

# Delay heavy imports (PyPDF2, reportlab) until functions are called so this module
# can be imported by the Flask app (via adapter) without requiring those packages
# to be present at import-time.

# Resolve paths relative to this script to avoid cwd differences between editors
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
template_path = os.path.join(BASE_DIR, "PraviTekst.pdf")

# Verify template exists at startup
if not os.path.exists(template_path):
    print(f"⚠️  Template not found at: {template_path}")


def create_default_template(path):
    """Create a simple one-page placeholder PDF so the rest of the script can run during development."""
    # import reportlab here to avoid import-time dependency
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas

    c = canvas.Canvas(path, pagesize=letter)
    c.setFont("Times-Roman", 16)
    c.drawString(72, 720, "Placeholder template - PraviTekst.pdf")
    c.setFont("Times-Roman", 10)
    c.drawString(72, 700, "This file was auto-created as a placeholder. Replace with your real template.")
    c.save()


def _add_text_overlay_on_matching_pages(
    reader,
    full_name: str,
    jmbg: str,
    city: str,
    date_of_birth: str,
    years_of_study: str,
    academic_year: str,
    search_text: str = "Potvrduje se da je "
) -> object:
    """
    Zadržava tvoju logiku: ako stranica sadrži `search_text`, crta overlay na toj stranici.
    Vraća PdfWriter spreman za zapis u BytesIO.
    """
    # import PdfWriter and reportlab canvas locally
    from PyPDF2 import PdfWriter
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas

    writer = PdfWriter()
    any_matched = False

    for page_num, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""
        
        # Check if this page should have overlay applied
        if search_text in page_text:
            print(f"✅ Match found on page {page_num} - applying overlay")
            any_matched = True
            packet = io.BytesIO()
            can = canvas.Canvas(packet, pagesize=letter)

            
            # --- tvoje koordinate i tekstovi (samo parametrizovano) ---
            can.setFont("Times-Roman", 12)
            can.drawString(125, 675, "IPI Akademija Tuzla")
            can.drawString(200, 550, full_name)
            can.drawString(200, 525, jmbg)
            can.drawString(200, 497, date_of_birth)
            can.drawString(320, 497, city)
            can.drawString(275, 470, city)
            can.drawString(320, 450, years_of_study)
            can.setFont("Times-Roman", 10)
            can.drawString(280, 425, academic_year)
            can.setFont("Times-Roman", 12)
            can.drawString(155, 320, city)
            can.drawString(235, 320, city)
            can.drawString(375, 305, "Potpis nekog iz službe")

            can.save()
            packet.seek(0)
            # overlay reader can reuse PdfReader from PyPDF2
            from PyPDF2 import PdfReader as _PdfReader
            overlay_pdf = _PdfReader(packet)
            page.merge_page(overlay_pdf.pages[0])

        writer.add_page(page)

    print(f"\n📊 Summary: any_matched={any_matched}, total pages={len(reader.pages)}")
    # Ako nijedna stranica nije matchala, i dalje vraćamo original (bez overlaya)
    return writer


def generate_health_pdf(
    full_name: str,
    jmbg: str,
    city: str,
    date_of_birth: str,
    years_of_study: str,
    academic_year: str,
    search_text: str = "Potvrduje se da je "
) -> io.BytesIO:
    """
    Glavna funkcija: koristi tvoj overlay pristup i vraća PDF kao BytesIO (nema snimanja na disk).
    """
    print("Generating health certificate PDF...")

    if not os.path.exists(template_path):
        print(f"Template not found at {template_path}. Creating a placeholder PDF...")
        create_default_template(template_path)

    # import PdfReader locally to avoid import-time dependency
    from PyPDF2 import PdfReader

    reader = PdfReader(template_path)
    writer = _add_text_overlay_on_matching_pages(
        reader=reader,
        full_name=full_name,
        jmbg=jmbg,
        city=city,
        date_of_birth=date_of_birth,
        years_of_study=str(years_of_study),
        academic_year=str(academic_year),
        search_text=search_text
    )

    out_buf = io.BytesIO()
    writer.write(out_buf)
    out_buf.seek(0)
    return out_buf
