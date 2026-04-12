"""
Test skripta za provjeru NLP servisa
Testira:
1. Učitavanje environment varijabli
2. Mistral AI konekciju
3. RAG sistem
4. Generisanje odgovora
"""

import os

from dotenv import load_dotenv

# Učitaj .env
load_dotenv()


def test_env_variables():
    """Test 1: Provjeri da li su env varijable učitane"""
    print("🔍 TEST 1: Environment Varijable")
    print("-" * 50)

    github_token = os.getenv("GITHUB_TOKEN")
    github_endpoint = os.getenv("GITHUB_ENDPOINT")
    mistral_model = os.getenv("MISTRAL_MODEL")
    openai_key = os.getenv("OPEN_API_KEY_OPENAI")

    results = {
        "GITHUB_TOKEN": "✅ Postoji" if github_token else "❌ Nedostaje",
        "GITHUB_ENDPOINT": "✅ Postoji" if github_endpoint else "❌ Nedostaje",
        "MISTRAL_MODEL": "✅ Postoji" if mistral_model else "❌ Nedostaje",
        "OPEN_API_KEY_OPENAI": "✅ Postoji" if openai_key else "❌ Nedostaje",
    }

    for key, status in results.items():
        print(f"  {key}: {status}")

    print()
    return all("✅" in v for v in results.values())


def test_mistral_connection():
    """Test 2: Provjeri Mistral AI konekciju"""
    print("🤖 TEST 2: Mistral AI Konekcija")
    print("-" * 50)

    try:
        from mistralai import Mistral, SystemMessage, UserMessage

        token = os.getenv("GITHUB_TOKEN")
        endpoint = os.getenv("GITHUB_ENDPOINT", "https://models.github.ai/inference")
        model_name = os.getenv("MISTRAL_MODEL", "mistral-ai/mistral-medium-2505")

        client = Mistral(api_key=token, server_url=endpoint)

        # Jednostavan test poziv
        response = client.chat.complete(
            model=model_name,
            messages=[
                SystemMessage(content="You are a helpful assistant."),
                UserMessage(content="Reci samo 'Test uspješan!' i ništa više."),
            ],
            temperature=1.0,
            max_tokens=1000,
            top_p=1.0,
        )

        ai_response = response.choices[0].message.content
        print(f"  ✅ Mistral AI odgovorio: '{ai_response}'")
        print()
        return True

    except Exception as e:
        print(f"  ❌ Greška: {e}")
        print()
        return False


def test_rag_system():
    """Test 3: Provjeri RAG sistem"""
    print("📚 TEST 3: RAG Sistem")
    print("-" * 50)

    try:
        from rag_system import RAGSystem

        rag = RAGSystem()
        print("  ✅ RAG sistem inicijalizovan")
        print("  📊 FAISS index je aktivan")

        # Test pretraživanje
        test_query = "koliko košta studij"
        results = rag.get_context_for_llm(test_query, n_results=2)

        print(f"  🔍 Test pretraživanje: '{test_query}'")
        print(f"  📝 Dužina konteksta: {len(results)} karaktera")
        print()
        return True

    except Exception as e:
        print(f"  ❌ RAG sistem nije dostupan: {e}")
        print("  ⚠️  Fallback na keyword search će se koristiti")
        print()
        return False


def test_full_response():
    """Test 4: Kompletan test generisanja odgovora"""
    print("💬 TEST 4: Generisanje Odgovora")
    print("-" * 50)

    try:
        from app.services import generate_response_with_rag

        test_query = "Gdje se nalazi IPI Akademija?"
        test_context = (
            "IPI Akademija se nalazi u Tuzli, Bosna i Hercegovina. Adresa je Univerzitetska 1."
        )

        response = generate_response_with_rag(test_query, test_context)

        print(f"  📥 Pitanje: {test_query}")
        print(f"  📤 Odgovor: {response[:150]}...")
        print("  ✅ Generisanje odgovora uspješno!")
        print()
        return True

    except Exception as e:
        print(f"  ❌ Greška: {e}")
        print()
        return False


def test_knowledge_base():
    """Test 5: Provjeri da li postoji knowledge base"""
    print("📖 TEST 5: Knowledge Base")
    print("-" * 50)

    try:
        from app.nlp_utils import load_text_file

        content = load_text_file("fakultetski_sadržaj.txt")
        print("  ✅ Fakultetski sadržaj učitan")
        print(f"  📊 Veličina: {len(content)} karaktera")
        print(f"  📄 Broj linija: {len(content.splitlines())}")
        print()
        return True

    except Exception as e:
        print(f"  ❌ Greška: {e}")
        print()
        return False


def run_all_tests():
    """Pokreni sve testove"""
    print("\n" + "=" * 50)
    print("🧪 IPI AKADEMIJA - NLP SERVIS TESTOVI")
    print("=" * 50 + "\n")

    results = {
        "Environment": test_env_variables(),
        "Mistral AI": test_mistral_connection(),
        "RAG Sistem": test_rag_system(),
        "Knowledge Base": test_knowledge_base(),
        "Generisanje Odgovora": test_full_response(),
    }

    print("=" * 50)
    print("📊 REZULTATI TESTOVA")
    print("=" * 50)

    for test_name, passed in results.items():
        status = "✅ PROŠAO" if passed else "❌ NIJE PROŠAO"
        print(f"  {test_name}: {status}")

    total = len(results)
    passed = sum(results.values())

    print("\n" + "=" * 50)
    print(f"🎯 UKUPNO: {passed}/{total} testova prošlo")
    print("=" * 50 + "\n")

    if passed == total:
        print("🎉 SVI TESTOVI SU PROŠLI! NLP servis je spreman za rad.")
    else:
        print("⚠️  Neki testovi nisu prošli. Provjeri greške iznad.")


if __name__ == "__main__":
    run_all_tests()
