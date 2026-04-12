"""
RAG (Retrieval-Augmented Generation) sistem za IPI Akademiju
Koristi FAISS za vector search i Mistral AI za generisanje odgovora
"""

import os
import pickle
from typing import Any

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


class RAGSystem:
    def __init__(self, knowledge_base_path: str = "fakultetski_sadržaj.txt") -> None:
        """
        Inicijalizuje RAG sistem sa FAISS vector database

        Args:
            knowledge_base_path: Putanja do fakultetskog sadržaja
        """
        self.knowledge_base_path: str = knowledge_base_path
        self.index_path: str = "faiss_index.bin"
        self.chunks_path: str = "text_chunks.pkl"

        # Inicijalizuj sentence transformer (podržava srpski jezik)
        print("🔄 Učitavam multilingual embedding model...")
        self.model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
        print("✅ Model učitan!")

        # Učitaj ili kreiraj FAISS index
        if os.path.exists(self.index_path) and os.path.exists(self.chunks_path):
            self._load_index()
        else:
            self._create_index()

    def _split_text_into_chunks(
        self, text: str, chunk_size: int = 500, overlap: int = 100
    ) -> list[str]:
        """
        Dijeli tekst na manje dijelove (chunks) za bolje pretraživanje.
        Svaki chunk počinje s imenom sekcije (header) kojoj pripada,
        a susjedni chunks dijele overlap znakova radi očuvanja konteksta.

        Args:
            text: Kompletan tekst
            chunk_size: Broj karaktera po chunk-u
            overlap: Broj znakova preklapanja između susjednih chunks

        Returns:
            Lista text chunks
        """
        lines = text.split("\n")
        chunks = []
        current_chunk = ""
        current_header = ""

        for line in lines:
            line = line.strip()
            if not line:
                continue

            if line.startswith("#"):
                # Sačuvaj trenutni chunk i zapamti novi header
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_header = line
                current_chunk = line + "\n"
            else:
                if len(current_chunk) + len(line) > chunk_size and current_chunk:
                    chunks.append(current_chunk.strip())
                    # Novi chunk počinje headerom sekcije + overlap sadržaja
                    overlap_text = (
                        current_chunk[-overlap:] if len(current_chunk) > overlap else current_chunk
                    )
                    current_chunk = current_header + "\n" + overlap_text + line + "\n"
                else:
                    current_chunk += line + "\n"

        if current_chunk:
            chunks.append(current_chunk.strip())

        return chunks

    def _create_index(self):
        """Kreira FAISS index iz fakultetskog sadržaja"""
        print("📚 Učitavam fakultetski sadržaj...")

        try:
            with open(self.knowledge_base_path, encoding="utf-8") as f:
                content = f.read()

            # Podijeli tekst na chunks
            self.chunks = self._split_text_into_chunks(content)
            print(f"✂️  Podijeljeno na {len(self.chunks)} dijelova")

            # Generiši embeddings za sve chunks
            print("🔮 Generišem embeddings...")
            embeddings = self.model.encode(self.chunks, show_progress_bar=True)
            embeddings = np.array(embeddings).astype("float32")

            # Normalizuj embeddings za cosine similarity (IndexFlatIP = dot product na normalizovanim vektorima)
            faiss.normalize_L2(embeddings)

            # Kreiraj FAISS index
            dimension = embeddings.shape[1]
            self.index = faiss.IndexFlatIP(
                dimension
            )  # Inner Product = cosine similarity (na normalizovanim vektorima)
            self.index.add(x=embeddings)

            # Sačuvaj index i chunks
            faiss.write_index(self.index, self.index_path)
            with open(self.chunks_path, "wb") as f:
                pickle.dump(self.chunks, f)

            print(f"✅ FAISS index kreiran sa {len(self.chunks)} vektora!")

        except Exception as e:
            print(f"❌ Greška pri kreiranju indexa: {e}")

    def _load_index(self):
        """Učitava postojeći FAISS index"""
        try:
            self.index = faiss.read_index(self.index_path)
            with open(self.chunks_path, "rb") as f:
                self.chunks = pickle.load(f)
            print(f"✅ Učitan FAISS index sa {len(self.chunks)} vektora")
        except Exception as e:
            print(f"❌ Greška pri učitavanju: {e}")
            self._create_index()

    def search(self, query: str, n_results: int = 3) -> dict[str, Any]:
        """
        Pretražuje knowledge base i vraća relevantne rezultate

        Args:
            query: Korisničko pitanje
            n_results: Broj rezultata za vraćanje

        Returns:
            Dictionary sa rezultatima pretrage
        """
        try:
            # Generiši embedding za query i normalizuj za cosine similarity
            query_embedding = self.model.encode([query])
            query_embedding = np.array(query_embedding).astype("float32")
            faiss.normalize_L2(query_embedding)

            # Pretraži FAISS index
            scores, indices = self.index.search(query_embedding, n_results)

            # Filtriraj po pragu relevantnosti (cosine similarity >= 0.35)
            SIMILARITY_THRESHOLD = 0.35
            results = []
            valid_scores = []
            for score, idx in zip(scores[0], indices[0], strict=False):
                if idx != -1 and float(score) >= SIMILARITY_THRESHOLD:
                    results.append(self.chunks[idx])
                    valid_scores.append(float(score))

            return {
                "query": query,
                "results": results,
                "distances": valid_scores,
                "success": True,
            }

        except Exception as e:
            print(f"❌ Greška pri pretraživanju: {e}")
            return {
                "query": query,
                "results": [],
                "distances": [],
                "success": False,
                "error": str(e),
            }

    def get_context_for_llm(self, query: str, n_results: int = 4) -> str:
        """
        Pronalazi relevantan kontekst za LLM

        Args:
            query: Korisničko pitanje
            n_results: Broj rezultata

        Returns:
            Formatirani kontekst za Mistral AI
        """
        search_results = self.search(query, n_results)

        if not search_results["success"] or not search_results["results"]:
            return "Nisam pronašao relevantan sadržaj o ovoj temi."

        # Kombinuj rezultate u jedan kontekst
        context_parts = []
        for i, doc in enumerate(search_results["results"], 1):
            context_parts.append(f"[Informacija {i}]\n{doc}\n")

        return "\n".join(context_parts)

    def rebuild_index(self):
        """Ponovo kreira index (korisno ako se promijeni sadržaj)"""
        if os.path.exists(self.index_path):
            os.remove(self.index_path)
        if os.path.exists(self.chunks_path):
            os.remove(self.chunks_path)
        self._create_index()


# Test funkcija
if __name__ == "__main__":
    print("🚀 Testiranje RAG sistema sa FAISS...\n")

    rag = RAGSystem()

    # Test pitanja
    test_queries = [
        "Koje studijske programe nudi IPI Akademija?",
        "Koliko košta studij na IPI?",
        "Ko je Amar Tubic?",
        "Gdje se nalazi IPI Akademija?",
    ]

    for query in test_queries:
        print(f"\n❓ Pitanje: {query}")
        context = rag.get_context_for_llm(query, n_results=2)
        print(f"📄 Kontekst:\n{context[:300]}...")
