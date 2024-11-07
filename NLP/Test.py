import os
import faiss
import numpy as np
from transformers import AutoTokenizer, AutoModel
import torch
from flask import Flask, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Postavljanje modela i učitavanje teksta
model_name = 'sentence-transformers/all-MiniLM-L6-v2'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

# Učitavanje i obrada teksta
def load_text_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def preprocess_text(text):
    return text.split('\n')

# Kreiranje embeddingsa
def create_embeddings(text_chunks):
    embeddings = []
    for chunk in text_chunks:
        inputs = tokenizer(chunk, return_tensors='pt', truncation=True, padding=True)
        with torch.no_grad():
            outputs = model(**inputs)
        embeddings.append(outputs.last_hidden_state.mean(dim=1).squeeze().numpy())
    return np.array(embeddings)

# Kreiranje FAISS indeksa
file_path = 'fakultetski_sadržaj.txt'  # Putanja do vašeg teksta
text = load_text_file(file_path)
text_chunks = preprocess_text(text)
embeddings = create_embeddings(text_chunks)
index = faiss.IndexFlatIP(embeddings.shape[1])
faiss.normalize_L2(embeddings)
index.add(embeddings)

# Endpoint za pretragu
@app.route('/search', methods=['POST'])
def search():
    data = request.json
    query = data.get("query")

    if not query:
        return jsonify({"error": "Query not provided"}), 400

    inputs = tokenizer(query, return_tensors='pt', truncation=True, padding=True)
    with torch.no_grad():
        query_embedding = model(**inputs).last_hidden_state.mean(dim=1).squeeze().numpy()
    faiss.normalize_L2(np.array([query_embedding]))
    _, I = index.search(np.array([query_embedding]), 5)  # Top 5 rezultata

    results = [text_chunks[i] for i in I[0]]
    return jsonify({"results": results})

if __name__ == '__main__':
    app.run(debug=True)
