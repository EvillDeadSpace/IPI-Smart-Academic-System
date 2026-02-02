from .normalize_text import normalize_text, STOP_WORDS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def preprocess(text: str) -> str:
    toks = normalize_text(text=text).split()
    return " ".join([t for t in toks if t not in STOP_WORDS])


def compare_two_text(file_a, file_b):
    def ensure_str(x):
        """
        Normalize input to a single string.

        Accepts either a string or a sequence (list or tuple) of elements such as
        text fragments returned by extract_text. If a list or tuple is provided,
        all elements are converted to strings and joined with newline characters.

        :param x: A string, or a list/tuple of items that can be converted to strings.
        :return: A single string representation of the input.
        """
        if isinstance(x, (list, tuple)):
            # join elements (make sure elements are strings)
            return "\n".join(str(e) for e in x)
        return x

    file_a = ensure_str(file_a)
    file_b = ensure_str(file_b)

    docs = [preprocess(file_a), preprocess(file_b)]
    vec = TfidfVectorizer(ngram_range=(1, 1), stop_words=STOP_WORDS).fit_transform(docs)
    sim_matrix = cosine_similarity(vec)
    overall = float(sim_matrix[0, 1])

    return {"score": overall, "matrix": sim_matrix.tolist()}
