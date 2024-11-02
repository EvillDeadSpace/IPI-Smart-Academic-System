
import requests

# URL stranice koju želiš preuzeti
url = 'https://ipi-akademija.ba'

try:
    # Preuzimanje sadržaja stranice
    response = requests.get(url)
    response.raise_for_status()  # Provjera za eventualne greške

    # Spremanje sadržaja u .txt fajl
    with open('stranica.txt', 'w', encoding='utf-8') as file:
        file.write(response.text)

    print("Sadržaj stranice je uspješno spremljen u 'stranica.txt'")

except requests.exceptions.RequestException as e:
    print(f"Greška prilikom preuzimanja stranice: {e}")