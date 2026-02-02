import re


def normalize_text(text):
    text = text.lower()
    text = text.replace("ć", "c").replace("č", "c")
    text = text.replace("đ", "d").replace("š", "s").replace("ž", "z")
    text = re.sub(r"[^a-z ]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


STOP_WORDS = [
    "i",
    "u",
    "na",
    "je",
    "da",
    "se",
    "su",
    "za",
    "od",
    "koji",
    "koja",
    "koje",
    "što",
    "kao",
    "ali",
    "ili",
    "te",
    "pa",
    "jer",
    "biti",
    "sam",
    "smo",
]
