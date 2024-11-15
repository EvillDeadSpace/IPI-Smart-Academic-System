# Koristi osnovni Python imidž
FROM python:3.10

# Instaliraj sistemske zavisnosti
RUN apt-get update && apt-get install -y \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

# Postavi radni direktorijum u kontejneru
WORKDIR /app

# Kopiraj requirements fajl
COPY requirements.txt .

# Prvo instaliraj faiss-cpu, kako bi taj sloj bio keširan
RUN pip install faiss-cpu==1.7.3

# Instaliraj ostale Python zavisnosti
RUN pip install --no-cache-dir -r requirements.txt

# Kopiraj sve fajlove iz lokalnog direktorijuma u kontejner
COPY . .

# Otvori port 5000
EXPOSE 5000

# Postavi komandu za pokretanje aplikacije
CMD ["python", "Test.py"]
