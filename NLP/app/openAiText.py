import os
from openai import OpenAI
import numpy as np
from numpy import dot
from numpy.linalg import norm

from dotenv import load_dotenv

load_dotenv()


token = os.getenv("OPEN_API_KEY_OPENAI")
endpoint = "https://models.inference.ai.azure.com"
model_name = "text-embedding-3-small"

client = OpenAI(
    base_url=endpoint,
    api_key=token,
)

def generate_embeddings_for_text(text):
    response = client.embeddings.create(
        input=[text],
        model=model_name,
    )
    embedding = response.data[0].embedding
    return embedding

def cosine_similarity(vec1, vec2):
    return dot(vec1, vec2) / (norm(vec1) * norm(vec2))

def get_top_n_sentences(query_embedding, sentences_embeddings, sentences, n=5):
    similarities = [cosine_similarity(query_embedding, sent_emb) for sent_emb in sentences_embeddings]
    top_n_indices = np.argsort(similarities)[-n:][::-1]
    top_n_sentences = [sentences[i] for i in top_n_indices]
    return top_n_sentences

def compare_query_with_sentences(query, sentences):
    query_embedding = generate_embeddings_for_text(query)
    sentences_embeddings = [generate_embeddings_for_text(sent) for sent in sentences]
    top_5_sentences = get_top_n_sentences(query_embedding, sentences_embeddings, sentences)
    return top_5_sentences

# Primer korišćenja


#query = "Peta recenica"
#sentences = ["Prva recenica.", "Druga recenica.", "Treća recenica.", "cetvrta recenica.", "Peta recenica.", "Sesta recenica."]
#top_5_sentences = compare_query_with_sentences(query, sentences)
#print("Top 5 najbliih recenica:", top_5_sentences)#