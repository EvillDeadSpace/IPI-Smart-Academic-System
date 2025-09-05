import re

def load_text_file(file_path):
    """Učitava tekstualni fajl"""
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def process_text(text):
    """Jednostavno procesiranje teksta - podela na rečenice"""
    # Podeli tekst na rečenice
    sentences = re.split(r'[.!?]+', text)
    # Ukloni prazne stringove i očisti bele znakove
    sentences = [sent.strip() for sent in sentences if sent.strip()]
    return sentences

def search_in_text(text, query):
    """Pretraži tekst za ključne reči - poboljšana verzija"""
    if not text or not query:
        return []
    
    # Podeli na linije
    lines = text.split('\n')
    keywords = query.lower().split()
    
    results = []
    
    # Prvo dodaj sve linije koje sadrže ključne reči
    for line in lines:
        if line.strip():  # Ignoriši prazne linije
            line_lower = line.lower()
            # Proveri da li linija sadrži bilo koju ključnu reč
            if any(keyword in line_lower for keyword in keywords):
                results.append(line.strip())
    
    # Dodaj specifične termine za studijske programe/smjerove
    study_keywords = ['program', 'smjer', 'studij', 'informatika', 'računarstvo', 'menadžment', 'tehnologij']
    
    if any(word in query.lower() for word in ['smjer', 'program', 'studij']):
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in study_keywords):
                if line.strip() not in results:  # Izbegni duplikate
                    results.append(line.strip())
    
    return results[:7]  # Vrati maksimalno 7 rezultata za bolji kontekst
