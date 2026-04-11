"""
Evaluacija tačnosti chatbota — IPI Smart Academic System
Poređenje: Sa RAG-om vs Bez RAG-a (direktan Mistral AI)

Pokretanje: python evaluate_rag.py
(iz NLP/ direktorija, sa aktivnim virtualnim okruženjem)
"""

import sys
import time

from dotenv import load_dotenv

load_dotenv()

# ─── Test pitanja sa očekivanim ključnim riječima ──────────────────────────────

TEST_QUESTIONS = [
    {
        "id": 1,
        "question": "Gdje se nalazi IPI Akademija?",
        "keywords": ["tuzla", "tuzli", "bosna", "adresa", "ulica", "lokacija"],
        "category": "Opće informacije",
    },
    {
        "id": 2,
        "question": "Koje studijske programe nudi IPI Akademija?",
        "keywords": ["informatik", "menadžment", "pravo", "program", "smjer", "studij"],
        "category": "Studijski programi",
    },
    {
        "id": 3,
        "question": "Kolika je cijena studija na IPI Akademiji?",
        "keywords": ["cijena", "školarin", "eur", "km", "godišnj", "rata", "plaćanj"],
        "category": "Finansije",
    },
    {
        "id": 4,
        "question": "Kako se prijaviti za upis na fakultet?",
        "keywords": ["prijav", "upis", "dokument", "konkurs", "prijavni", "rok"],
        "category": "Upis",
    },
    {
        "id": 5,
        "question": "Da li IPI nudi online nastavu?",
        "keywords": ["online", "daljinsk", "hybrid", "e-learning", "nastav", "predavanj"],
        "category": "Nastava",
    },
    {
        "id": 6,
        "question": "Koji su uslovi za dobijanje stipendije?",
        "keywords": ["stipendij", "uslov", "prosjek", "ocjen", "student", "finansij"],
        "category": "Stipendije",
    },
    {
        "id": 7,
        "question": "Koliko traje bachelor studij?",
        "keywords": ["3", "4", "godin", "semester", "bachelor", "preddiplomsk", "ects"],
        "category": "Trajanje studija",
    },
    {
        "id": 8,
        "question": "Ko su profesori na IPI Akademiji?",
        "keywords": ["profesor", "doktor", "nastavnik", "osoblje", "dr.", "prof."],
        "category": "Nastavno osoblje",
    },
]

# ─── Scoring funkcija ──────────────────────────────────────────────────────────


def score_answer(answer: str, keywords: list[str]) -> tuple[int, list[str]]:
    """Vraća (score 0-2, lista pronađenih ključnih riječi)"""
    answer_lower = answer.lower()
    found = [kw for kw in keywords if kw in answer_lower]

    if len(found) >= 2:
        return 2, found  # Tačan odgovor
    elif len(found) == 1:
        return 1, found  # Djelimično tačan
    else:
        return 0, []  # Netačan / nema informacija


# ─── Glavni test ──────────────────────────────────────────────────────────────


def run_evaluation():
    print("\n" + "═" * 70)
    print("  EVALUACIJA CHATBOTA — IPI Smart Academic System")
    print("  Poređenje: RAG sistem vs Direktan AI (bez konteksta)")
    print("═" * 70)

    # Učitaj RAG sistem
    print("\n🔄 Inicijalizacija RAG sistema...")
    try:
        from rag_system import RAGSystem

        rag = RAGSystem()
        print("✅ RAG sistem spreman!\n")
    except Exception as e:
        print(f"❌ RAG sistem nije dostupan: {e}")
        sys.exit(1)

    # Uvezi funkciju za generisanje odgovora
    from app.services import generate_response_with_rag

    results = []

    for q in TEST_QUESTIONS:
        print(f"[{q['id']}/8] Testiram: {q['question']}")

        # ── Sa RAG-om ──────────────────────────────────────────────────────────
        context = rag.get_context_for_llm(q["question"], n_results=3)
        time.sleep(1)  # Rate limit zaštita

        try:
            answer_rag = generate_response_with_rag(q["question"], context)
            score_rag, found_rag = score_answer(answer_rag, q["keywords"])
        except Exception as e:
            answer_rag = f"GREŠKA: {e}"
            score_rag, found_rag = 0, []

        time.sleep(2)

        # ── Bez RAG-a (prazan kontekst) ────────────────────────────────────────
        try:
            answer_no_rag = generate_response_with_rag(q["question"], context="")
            score_no_rag, found_no_rag = score_answer(answer_no_rag, q["keywords"])
        except Exception as e:
            answer_no_rag = f"GREŠKA: {e}"
            score_no_rag, found_no_rag = 0, []

        time.sleep(2)

        results.append(
            {
                "id": q["id"],
                "question": q["question"],
                "category": q["category"],
                "score_rag": score_rag,
                "score_no_rag": score_no_rag,
                "found_rag": found_rag,
                "found_no_rag": found_no_rag,
                "answer_rag": answer_rag,
                "answer_no_rag": answer_no_rag,
            }
        )

        label = {2: "✓ Tačan", 1: "~ Djelimičan", 0: "✗ Netačan"}
        print(f"   Sa RAG-om:  {label[score_rag]}")
        print(f"   Bez RAG-a:  {label[score_no_rag]}\n")

    # ─── Finalni report ────────────────────────────────────────────────────────

    total = len(results)
    rag_correct = sum(1 for r in results if r["score_rag"] == 2)
    rag_partial = sum(1 for r in results if r["score_rag"] == 1)
    rag_wrong = sum(1 for r in results if r["score_rag"] == 0)

    norag_correct = sum(1 for r in results if r["score_no_rag"] == 2)
    norag_partial = sum(1 for r in results if r["score_no_rag"] == 1)
    norag_wrong = sum(1 for r in results if r["score_no_rag"] == 0)

    rag_score_pct = round((rag_correct * 2 + rag_partial) / (total * 2) * 100)
    norag_score_pct = round((norag_correct * 2 + norag_partial) / (total * 2) * 100)

    label = {2: "✓ Tačan    ", 1: "~ Djelimičan", 0: "✗ Netačan  "}

    summary = f"""
╔══════════════════════════════════════════════════════════════════════╗
║        REZULTATI EVALUACIJE — IPI Smart Academic System Chatbot      ║
╠══════════════════════════════════════════════════════════════════════╣
║  Metoda evaluacije: keyword matching na {total} testnih pitanja          ║
║  Scoring: Tačan = 2 boda | Djelimičan = 1 bod | Netačan = 0 bodova ║
╠════════════╦══════════════════════════════╦══════════════════════════╣
║  Pitanje   ║   Sa RAG-om (vector search)  ║   Bez RAG-a (direktan)  ║
╠════════════╬══════════════════════════════╬══════════════════════════╣"""

    for r in results:
        q_str = f"P{r['id']}: {r['question'][:28]}..."
        print_str = f"\n║  {q_str:<28}  ║  {label[r['score_rag']]}  ({r['score_rag']}/2)        ║  {label[r['score_no_rag']]}  ({r['score_no_rag']}/2)   ║"
        summary += print_str

    summary += f"""
╠════════════╩══════════════════════════════╩══════════════════════════╣
║  UKUPNO    ║  Tačnih: {rag_correct}/8  Djelim: {rag_partial}/8  Netačnih: {rag_wrong}/8   ║  Tačnih: {norag_correct}/8  Djelim: {norag_partial}/8  Net: {norag_wrong}/8  ║
║            ║  UKUPAN SCORE: {rag_score_pct}%                         ║  UKUPAN SCORE: {norag_score_pct}%                 ║
╠════════════╩══════════════════════════════╩══════════════════════════╣
║  ZAKLJUČAK: RAG poboljšava tačnost za {rag_score_pct - norag_score_pct} procentnih poena             ║
╚══════════════════════════════════════════════════════════════════════╝
"""

    print(summary)

    # ─── Detalji odgovora po pitanju ──────────────────────────────────────────
    print("\n" + "─" * 70)
    print("  DETALJI ODGOVORA PO PITANJU")
    print("─" * 70)

    for r in results:
        print(f"\nP{r['id']}: {r['question']}")
        print(f"  [Sa RAG-om — score {r['score_rag']}/2]")
        print(f"  {r['answer_rag'][:200]}{'...' if len(r['answer_rag']) > 200 else ''}")
        print(f"  [Bez RAG-a — score {r['score_no_rag']}/2]")
        print(f"  {r['answer_no_rag'][:200]}{'...' if len(r['answer_no_rag']) > 200 else ''}")

    # Spremi summary u fajl
    with open("evaluation_results.txt", "w", encoding="utf-8") as f:
        f.write(summary)
        f.write("\n\nDETALJI ODGOVORA:\n")
        for r in results:
            f.write(f"\nP{r['id']}: {r['question']}\n")
            f.write(f"[Sa RAG-om — {r['score_rag']}/2]\n{r['answer_rag']}\n")
            f.write(f"[Bez RAG-a — {r['score_no_rag']}/2]\n{r['answer_no_rag']}\n")
            f.write("─" * 60 + "\n")

    print("\n📄 Puni rezultati sačuvani u: evaluation_results.txt")
    print("📸 Screenshot gornje tabele možeš koristiti u diplomskom!\n")


if __name__ == "__main__":
    run_evaluation()
