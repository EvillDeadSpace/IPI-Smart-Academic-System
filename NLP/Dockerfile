# Odaberi osnovnu sliku
FROM python:3.9-slim

# Postavi radni direktorijum
WORKDIR /app

# Kopiraj requirements.txt i instaliraj zavisnosti
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Kopiraj sve ostale fajlove
COPY . .

# Definiši komandu koja će se izvršiti kada kontejner krene
CMD ["python", "scrap.py"]
