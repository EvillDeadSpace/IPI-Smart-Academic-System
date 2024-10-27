import requests
from bs4 import BeautifulSoup

# URL tvoje fakultetske stranice
url = 'https://ipi-akademija.ba/informatika-i-racunarstvo'
response = requests.get(url)

# Parsiranje HTML sadržaja
soup = BeautifulSoup(response.content, 'html.parser')

# Pronađi sve <p> tagove ili druge elemente koje želiš
texts = soup.find_all('p')

# Ekstrakcija teksta
document_texts = [text.get_text() for text in texts]

# Čuvanje teksta u datoteku
with open('fakultetski_sadržaj.txt', 'w', encoding='utf-8') as file:
    for text in document_texts:
        file.write(text + '\n')
