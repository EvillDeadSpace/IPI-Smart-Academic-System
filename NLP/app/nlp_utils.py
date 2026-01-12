import re
from typing import List


def load_text_file(file_path: str) -> str:
    """
    Load text content from a file.
    
    Args:
        file_path: Path to the text file to load
        
    Returns:
        str: Complete file content as string
        
    Raises:
        FileNotFoundError: If the file doesn't exist
        UnicodeDecodeError: If the file encoding is not UTF-8
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()


def process_text(text: str) -> List[str]:
    """
    Process text by splitting into sentences.
    
    Splits text on common sentence delimiters (., !, ?) and removes
    empty strings and extra whitespace.
    
    Args:
        text: Input text to process
        
    Returns:
        List[str]: List of cleaned sentences
    """
    sentences = re.split(r'[.!?]+', text)
    sentences = [sent.strip() for sent in sentences if sent.strip()]
    return sentences


def search_in_text(text: str, query: str) -> List[str]:
    """
    Search text for relevant lines matching query keywords.
    
    Performs keyword-based search with support for academic terms
    (study programs, majors, etc.). Returns up to 7 most relevant lines.
    
    Args:
        text: Source text to search in
        query: Search query (can contain multiple keywords)
        
    Returns:
        List[str]: Up to 7 matching lines, empty list if no matches
        
    Examples:
        >>> search_in_text("Computer Science program...", "program")
        ['Computer Science program...']
    """
    if not text or not query:
        return []
    
    lines = text.split('\n')
    keywords = query.lower().split()
    results = []
    
    # First pass: add all lines containing any keyword
    for line in lines:
        if line.strip():
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in keywords):
                results.append(line.strip())
    
    # Second pass: enhance with academic-specific terms
    study_keywords = [
        'program', 'smjer', 'studij', 'informatika', 
        'računarstvo', 'menadžment', 'tehnologij'
    ]
    
    if any(word in query.lower() for word in ['smjer', 'program', 'studij']):
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in study_keywords):
                if line.strip() not in results:
                    results.append(line.strip())
    
    return results[:7]
