import spacy

# Učitavanje NLP modela
nlp = spacy.load("hr_core_news_sm")

def load_text_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def process_text(text):
    return nlp(text)  # Pretvara string u spaCy `Doc` objekt
