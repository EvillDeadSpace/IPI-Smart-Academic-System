import pdfplumber
from docx import Document


def extract_text(file_from_user):
    if not isinstance(file_from_user, (list, tuple)):
        file_from_user = [file_from_user]

    texts = []
    for file in file_from_user:
        if file.filename.endswith(".pdf"):
            with pdfplumber.open(file.stream) as pdf:
                text = "\n".join(page.extract_text() or "" for page in pdf.pages)
            texts.append(text)
        elif file.filename.endswith(".docx"):
            doc = Document(file.stream)
            text = "\n".join(para.text for para in doc.paragraphs)
            texts.append(text)
        else:
            return "Samo PDF i DOCX fajlovi!", 400
    return texts
