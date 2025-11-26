#!/usr/bin/env python3
import requests
import json

def test_search():
    url = "http://127.0.0.1:5001/search"
    
    # Test pitanja
    queries = [
        "cijena fakulteta",
        "koliko košta fakultet", 
        "2500KM",
        "cijena",
        "nova"
    ]
    
    for query in queries:
        try:
            print(f"\n🔍 Testiram: '{query}'")
            
            response = requests.post(url, 
                json={"word": query},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Response: {data.get('response', 'No response')}")
                print(f"📄 Context: {len(data.get('context_used', []))} rezultata")
                
                # Prikaži context
                for i, ctx in enumerate(data.get('context_used', [])):
                    print(f"  {i+1}. {ctx.get('content', '')[:100]}... (score: {ctx.get('score', 0)})")
            else:
                print(f"❌ Error {response.status_code}: {response.text}")
                
        except Exception as e:
            print(f"❌ Greška: {e}")

if __name__ == "__main__":
    test_search()
