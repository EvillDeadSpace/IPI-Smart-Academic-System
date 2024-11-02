# Koristi osnovni Python imidž
FROM python:3.9-slim

# Instaliraj sistemske zavisnosti
RUN apt-get update && apt-get install -y \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

# Postavi radni direktorijum u kontejneru
WORKDIR /app

# Kopiraj requirements fajl i instaliraj Python zavisnosti
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Kopiraj sve fajlove iz lokalnog direktorijuma u kontejner
COPY . .

# Postavi komandnu za pokretanje aplikacije
CMD ["python", "Test.py"]
