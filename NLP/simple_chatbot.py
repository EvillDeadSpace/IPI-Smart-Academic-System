"""
🎓 IPI AKADEMIJA - JEDNOSTAVAN AI CHATBOT
==========================================

Ovaj fajl sadrži sve što vam je potrebno za funkcionalan AI chatbot
koji koristi vašu bazu znanja o IPI Akademiji.

Koristi:
- GitHub Models Marketplace (Mistral AI)
- Jednostavno keyword pretrage
- Direktan pristup vašoj bazi znanja

"""

import os
import re
from dotenv import load_dotenv

# Učitaj environment varijable
load_dotenv()

class IPIChatbot:
    def __init__(self):
        """Inicijalizuj chatbot sa bazom znanja"""
        self.knowledge_base = self.load_knowledge_base()
        
    def load_knowledge_base(self):
        """Učitaj fakultetski sadržaj"""
        try:
            with open('fakultetski_sadržaj.txt', 'r', encoding='utf-8') as f:
                content = f.read()
            print("✅ Uspešno učitana baza znanja")
            return content
        except Exception as e:
            print(f"❌ Greška pri učitavanju: {e}")
            return ""
    
    def search_knowledge(self, query, max_results=3):
        """Pretraži bazu znanja po ključnim rečima"""
        if not self.knowledge_base:
            return []
        
        # Podeli sadržaj na linije
        lines = self.knowledge_base.split('\n')
        
        # Ključne reči iz korisničke pretrage
        keywords = query.lower().split()
        
        results = []
        for line in lines:
            if line.strip():  # Ignoriši prazne linije
                line_lower = line.lower()
                # Proveri da li linija sadrži bilo koju ključnu reč
                if any(keyword in line_lower for keyword in keywords):
                    results.append(line.strip())
        
        # Vrati ograničen broj rezultata
        return results[:max_results]
    
    def format_context(self, search_results):
        """Formatuj rezultate pretrage za kontekst"""
        if not search_results:
            return "Izvinjavam se, nisu pronađene informacije o tome u bazi znanja."
        
        context = "Na osnovu informacija o IPI Akademiji:\n\n"
        for i, result in enumerate(search_results, 1):
            context += f"{i}. {result}\n"
        
        return context
    
    def get_ai_response(self, user_question, context):
        """Generiši AI odgovor koristeći GitHub Models"""
        try:
            # GitHub Models Marketplace API
            import requests
            
            # API endpoint
            url = "https://models.inference.ai.azure.com/chat/completions"
            
            # Headers
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {os.getenv('GITHUB_TOKEN')}"
            }
            
            # Sistem prompt
            system_prompt = """Ti si AI asistent za IPI Akademiju Tuzla. 
            Odgovori na srpskom jeziku, kratko i precizno.
            Koristi samo informacije iz konteksta.
            Budi ljubazan i profesionalan."""
            
            # Pripremi poruke
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Kontekst: {context}\n\nPitanje: {user_question}"}
            ]
            
            # API zahtev
            data = {
                "messages": messages,
                "model": "Mistral-small",
                "temperature": 0.7,
                "max_tokens": 300
            }
            
            response = requests.post(url, headers=headers, json=data)
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content']
            else:
                return f"Greška API poziva: {response.status_code}"
                
        except Exception as e:
            return f"Greška: {e}"
    
    def chat(self, user_question):
        """Glavna chat funkcija"""
        print(f"\n🔍 Pretražujem: {user_question}")
        
        # Pretraži bazu znanja
        search_results = self.search_knowledge(user_question)
        
        if not search_results:
            return "Izvinjavam se, nisu pronađene informacije o tome u našoj bazi znanja o IPI Akademiji."
        
        # Formatuj kontekst
        context = self.format_context(search_results)
        
        # Generiši AI odgovor
        print("🤖 Generišem odgovor...")
        ai_response = self.get_ai_response(user_question, context)
        
        return ai_response

def main():
    """Glavni program - interaktivni chat"""
    print("🎓 IPI AKADEMIJA - AI CHATBOT")
    print("="*50)
    print("Pitajte me bilo šta o IPI Akademiji!")
    print("Ukucajte 'quit' za izlaz\n")
    
    # Inicijalizuj chatbot
    chatbot = IPIChatbot()
    
    if not chatbot.knowledge_base:
        print("❌ Ne mogu da učitam bazu znanja. Proverite da li postoji 'fakultetski_sadržaj.txt'")
        return
    
    # Interaktivni chat
    while True:
        user_input = input("\n💬 Vaše pitanje: ").strip()
        
        if user_input.lower() in ['quit', 'exit', 'izlaz']:
            print("👋 Hvala što ste koristili IPI chatbot!")
            break
        
        if not user_input:
            continue
        
        # Generiši odgovor
        response = chatbot.chat(user_input)
        print(f"\n🤖 IPI Akademija: {response}")

if __name__ == "__main__":
    main()
