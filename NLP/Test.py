import os
import faiss
import numpy as np
from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.metrics.pairwise import cosine_similarity

def load_text_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def preprocess_text(text):
    # Split text into sentences or paragraphs
    return text.split('\n')

def create_embeddings(text_chunks, model, tokenizer):
    embeddings = []
    for chunk in text_chunks:
        inputs = tokenizer(chunk, return_tensors='pt', truncation=True, padding=True)
        with torch.no_grad():
            outputs = model(**inputs)
        embeddings.append(outputs.last_hidden_state.mean(dim=1).squeeze().numpy())
    return np.array(embeddings)

def build_faiss_index(embeddings):
    index = faiss.IndexFlatIP(embeddings.shape[1])  # Use inner product for cosine similarity
    faiss.normalize_L2(embeddings)  # Normalize embeddings for cosine similarity
    index.add(embeddings)
    return index

def find_similar_chunk(query, index, text_chunks, model, tokenizer):
    inputs = tokenizer(query, return_tensors='pt', truncation=True, padding=True)
    with torch.no_grad():
        query_embedding = model(**inputs).last_hidden_state.mean(dim=1).squeeze().numpy()
    faiss.normalize_L2(np.array([query_embedding]))  # Normalize query embedding for cosine similarity
    _, I = index.search(np.array([query_embedding]), 5)  # Retrieve top 5 results
    return [text_chunks[i] for i in I[0]]

def main():
    # Set environment variable to avoid OpenMP runtime error
    os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

    file_path = 'fakultetski_sadržaj.txt'  # Replace with your .txt file path
    text = load_text_file(file_path)
    text_chunks = preprocess_text(text)

    # Load pre-trained model and tokenizer
    model_name = 'sentence-transformers/all-MiniLM-L6-v2'
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name)

    # Create embeddings and build FAISS index
    embeddings = create_embeddings(text_chunks, model, tokenizer)
    index = build_faiss_index(embeddings)

    print("Welcome to the chatbot! Type 'exit' to end the conversation.")
    while True:
        query = input("You: ")
        if query.lower() == 'exit':
            print("Goodbye!")
            break
        answers = find_similar_chunk(query, index, text_chunks, model, tokenizer)
        print("Bot: Here are the top answers:")
        for answer in answers:
            print(f"- {answer}")

if __name__ == "__main__":
    main()