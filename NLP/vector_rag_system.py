"""
IPI Akademija - RAG System sa Vector Embeddings
Implementacija kompletnog RAG (Retrieval-Augmented Generation) sistema

Plan implementacije:
1. Kreiranje vector embeddings za sve sekcije
2. Čuvanje u lokalnoj bazi ili Pinecone
3. Semantic search umesto keyword matching
4. Poboljšan response generation
"""

import os
import json
import pickle
import numpy as np
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class IPIVectorRAG:
    def __init__(self, use_pinecone=False):
        self.use_pinecone = use_pinecone
        self.knowledge_chunks = []
        self.embeddings = []
        self.metadata = []
        
        if use_pinecone:
            self.setup_pinecone()
        else:
            self.setup_local_storage()
    
    def setup_pinecone(self):
        """Setup Pinecone vector database"""
        try:
            import pinecone
            from pinecone import Pinecone, ServerlessSpec
            
            # Initialize Pinecone
            pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
            
            index_name = "ipi-akademija"
            
            # Create index if it doesn't exist
            if index_name not in pc.list_indexes().names():
                pc.create_index(
                    name=index_name,
                    dimension=1536,  # OpenAI text-embedding-3-small dimension
                    metric='cosine',
                    spec=ServerlessSpec(
                        cloud='aws',
                        region='us-east-1'
                    )
                )
            
            self.index = pc.Index(index_name)
            print("✅ Pinecone setup uspešan")
            
        except Exception as e:
            print(f"❌ Pinecone greška: {e}")
            print("🔄 Prebacujem na lokalno čuvanje...")
            self.use_pinecone = False
            self.setup_local_storage()
    
    def setup_local_storage(self):
        """Setup lokalnog čuvanja embeddings"""
        self.vector_db_path = "vector_database.pkl"
        self.metadata_path = "vector_metadata.json"
        print("✅ Lokalno čuvanje konfigurisano")
    
    def load_and_chunk_content(self):
        """Učitava i deli sadržaj na chunksove"""
        try:
            with open('fakultetski_sadržaj.txt', 'r', encoding='utf-8') as f:
                content = f.read()
            
            chunks = []
            current_chunk = ""
            current_section = ""
            
            for line in content.split('\n'):
                line = line.strip()
                
                if line.startswith('##'):  # Sekcija
                    if current_chunk:
                        chunks.append({
                            'text': current_chunk.strip(),
                            'section': current_section,
                            'type': 'section'
                        })
                    current_section = line.replace('##', '').strip()
                    current_chunk = line + '\n'
                    
                elif line.startswith('-') and len(line) > 30:  # Bullet point
                    chunks.append({
                        'text': line.replace('-', '').strip(),
                        'section': current_section,
                        'type': 'bullet'
                    })
                    
                elif len(line) > 50:  # Dugačka rečenica
                    chunks.append({
                        'text': line,
                        'section': current_section,
                        'type': 'paragraph'
                    })
            
            self.knowledge_chunks = chunks
            print(f"✅ Kreiran {len(chunks)} chunksova")
            return chunks
            
        except Exception as e:
            print(f"❌ Greška pri učitavanju: {e}")
            return []
    
    def generate_embeddings(self):
        """Generiše embeddings za sve chunksove"""
        if not self.knowledge_chunks:
            print("❌ Nema chunksova za embedding")
            return
        
        try:
            from openai import OpenAI
            
            client = OpenAI(
                base_url="https://models.inference.ai.azure.com",
                api_key=os.getenv("OPEN_API_KEY_OPENAI"),
            )
            
            print(f"🔄 Generiram embeddings za {len(self.knowledge_chunks)} chunksova...")
            
            for i, chunk in enumerate(self.knowledge_chunks):
                print(f"Obrađujem chunk {i+1}/{len(self.knowledge_chunks)}")
                
                # Generiši embedding
                response = client.embeddings.create(
                    input=[chunk['text']],
                    model="text-embedding-3-small",
                )
                
                embedding = response.data[0].embedding
                
                if self.use_pinecone:
                    # Store u Pinecone
                    self.index.upsert([{
                        'id': f"chunk_{i}",
                        'values': embedding,
                        'metadata': {
                            'text': chunk['text'],
                            'section': chunk['section'],
                            'type': chunk['type']
                        }
                    }])
                else:
                    # Store lokalno
                    self.embeddings.append(embedding)
                    self.metadata.append({
                        'id': f"chunk_{i}",
                        'text': chunk['text'],
                        'section': chunk['section'],
                        'type': chunk['type']
                    })
            
            if not self.use_pinecone:
                self.save_local_embeddings()
            
            print("✅ Embeddings uspešno generirani!")
            
        except Exception as e:
            print(f"❌ Greška pri generisanju embeddings: {e}")
    
    def save_local_embeddings(self):
        """Čuva embeddings lokalno"""
        try:
            # Čuvaj embeddings
            with open(self.vector_db_path, 'wb') as f:
                pickle.dump(self.embeddings, f)
            
            # Čuvaj metadata
            with open(self.metadata_path, 'w', encoding='utf-8') as f:
                json.dump(self.metadata, f, ensure_ascii=False, indent=2)
            
            print("✅ Embeddings sačuvani lokalno")
            
        except Exception as e:
            print(f"❌ Greška pri čuvanju: {e}")
    
    def load_local_embeddings(self):
        """Učitava lokalne embeddings"""
        try:
            if os.path.exists(self.vector_db_path) and os.path.exists(self.metadata_path):
                with open(self.vector_db_path, 'rb') as f:
                    self.embeddings = pickle.load(f)
                
                with open(self.metadata_path, 'r', encoding='utf-8') as f:
                    self.metadata = json.load(f)
                
                print(f"✅ Učitano {len(self.embeddings)} embeddings iz lokalne baze")
                return True
            return False
            
        except Exception as e:
            print(f"❌ Greška pri učitavanju: {e}")
            return False
    
    def semantic_search(self, query, top_k=3):
        """Semantic pretraga kroz embeddings"""
        try:
            from openai import OpenAI
            
            client = OpenAI(
                base_url="https://models.inference.ai.azure.com",
                api_key=os.getenv("OPEN_API_KEY_OPENAI"),
            )
            
            # Generiši query embedding
            response = client.embeddings.create(
                input=[query],
                model="text-embedding-3-small",
            )
            query_embedding = response.data[0].embedding
            
            if self.use_pinecone:
                # Pretraži Pinecone
                results = self.index.query(
                    vector=query_embedding,
                    top_k=top_k,
                    include_metadata=True
                )
                
                return [{
                    'text': match.metadata['text'],
                    'section': match.metadata['section'],
                    'score': match.score
                } for match in results.matches]
                
            else:
                # Pretraži lokalno
                similarities = []
                for i, embedding in enumerate(self.embeddings):
                    similarity = np.dot(query_embedding, embedding) / (
                        np.linalg.norm(query_embedding) * np.linalg.norm(embedding)
                    )
                    similarities.append((similarity, i))
                
                # Sortiraj po sličnosti
                similarities.sort(reverse=True)
                
                results = []
                for similarity, idx in similarities[:top_k]:
                    results.append({
                        'text': self.metadata[idx]['text'],
                        'section': self.metadata[idx]['section'],
                        'score': float(similarity)
                    })
                
                return results
                
        except Exception as e:
            print(f"❌ Greška pri pretraži: {e}")
            return []
    
    def generate_rag_response(self, query):
        """Generiše RAG odgovor"""
        try:
            # Semantic search
            relevant_chunks = self.semantic_search(query, top_k=3)
            
            if not relevant_chunks:
                return "Izvinjavam se, ne mogu da pronađem relevantne informacije."
            
            # Kreiraj kontekst
            context = "\n\n".join([chunk['text'] for chunk in relevant_chunks])
            
            # Generiši odgovor
            from mistralai import Mistral, UserMessage, SystemMessage
            
            client = Mistral(
                api_key=os.getenv("OPEN_API_KEY_MISTRAL"), 
                server_url="https://models.inference.ai.azure.com"
            )
            
            system_prompt = f"""Ti si AI asistent za IPI Akademiju Tuzla.

RELEVANTNI KONTEKST:
{context}

INSTRUKCIJE:
- Odgovaraj na bosanskom jeziku
- Koristi samo informacije iz konteksta
- Budi precizan i informativan
- Ako nemaš informaciju u kontekstu, reci da ne znaš
"""

            response = client.chat.complete(
                model="Mistral-small",
                messages=[
                    SystemMessage(content=system_prompt),
                    UserMessage(content=query),
                ],
                temperature=0.3,
                max_tokens=800,
            )
            
            return {
                'answer': response.choices[0].message.content,
                'sources': relevant_chunks,
                'context_used': context
            }
            
        except Exception as e:
            print(f"❌ Greška pri generisanju odgovora: {e}")
            return "Izvinjavam se, došlo je do greške."

def create_rag_system(use_pinecone=False):
    """Kreira kompletan RAG sistem"""
    print("🚀 Kreiram IPI Akademija RAG sistem...")
    
    rag = IPIVectorRAG(use_pinecone=use_pinecone)
    
    # Učitaj postojeće embeddings ili kreiraj nove
    if not use_pinecone and rag.load_local_embeddings():
        print("✅ Koristim postojeće embeddings")
    else:
        print("🔄 Kreiram nove embeddings...")
        rag.load_and_chunk_content()
        rag.generate_embeddings()
    
    return rag

if __name__ == "__main__":
    # Test bez Pinecone (lokalno)
    print("🧪 TESTIRANJE LOKALNOG RAG SISTEMA")
    print("="*50)
    
    rag = create_rag_system(use_pinecone=False)
    
    # Test pitanja
    test_queries = [
        "Koje studijske programe ima IPI Akademija?",
        "Ko su profesori?",
        "Koliko košta studij?",
        "Kako se upisati?"
    ]
    
    for query in test_queries:
        print(f"\n❓ PITANJE: {query}")
        print("-" * 30)
        
        result = rag.generate_rag_response(query)
        if isinstance(result, dict):
            print(f"🤖 ODGOVOR: {result['answer']}")
            print(f"📊 KÄLLOR: {len(result['sources'])} relevantnih chunksova")
        else:
            print(f"🤖 ODGOVOR: {result}")
