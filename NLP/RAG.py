from langchain.text_splitter import RecursiveCharacterTextSplitter

# Učitaj tekstualni fajl
with open("fakultetski_sadržaj.txt", "r") as file:
    text = file.read()

# Podeli tekst u manje delove
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
texts = text_splitter.split_text(text)