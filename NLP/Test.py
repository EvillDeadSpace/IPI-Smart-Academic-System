import spacy
from flask_cors import CORS
from flask import Flask, request, jsonify
from mistralai import Mistral, UserMessage, SystemMessage
import os


token = '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'
endpoint = "https://models.inference.ai.azure.com"
model_name = "Mistral-small"


app = Flask(__name__)
CORS(app)

# Učitavanje NLP modela
nlp = spacy.load("hr_core_news_sm")

# Učitavanje teksta iz fajla (samo jednom prilikom pokretanja aplikacije)
def load_text_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

text = load_text_file('fakultetski_sadržaj.txt')

# Procesiranje teksta pomoću NLP modela
doc = nlp(text) 

# Funkcija za pretragu rečenica koje sadrže sve ključne riječi
def find_sentence_with_keywords(doc, query):
    keywords = query.lower().split() 
    for sent in doc.sents:
        sentence_text = sent.text.lower()
        if all(keyword in sentence_text for keyword in keywords):
            return sent.text
    return None


client = Mistral(api_key=token, server_url=endpoint)

def test (user_msg):
    response = client.chat.complete(
    model=model_name,
    messages=[
        SystemMessage(content="Ti si pomocnik koji odgovara na pitanje o IPI akdemiji. Odgovaraj na bosanskom jeziku."),
        UserMessage(content=user_msg),
    ],
    temperature=1.0,
    max_tokens=1000,
    top_p=1.0
    )
    return response.choices[0].message.content


# Endpoint za pretragu
@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get('word', '').strip()  # Dohvati i očisti upit
    
    if not query:
        return jsonify({'error': 'Riječ ili fraza je obavezna!'}), 400

    sentence = find_sentence_with_keywords(doc, query)
    if sentence:
        proces_text= test(f'Na osnovu sljedeceg upita: {sentence}, odgovori mi na sljedece pitanje: {query}')
        return jsonify({'sentence': proces_text})
    else:
        return jsonify({'message': f"Nije pronađena odgovarajuća rečenica za upit '{query}'."})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
