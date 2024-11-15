# Koristimo oficijelni Node.js image kao bazu za build
FROM node:18-alpine AS build

# Postavljamo radni direktorijum u kontejneru
WORKDIR /app

# Kopiramo package.json i package-lock.json u radni direktorijum
COPY package*.json .

# Instaliramo zavisnosti
RUN npm install

# Kopiramo ostatak aplikacije u radni direktorijum
COPY . .

# Ekspozicija porta 3000
EXPOSE 5173

# Pokrećemo aplikaciju koristeći `serve`
CMD ["npm", "run", "dev"]