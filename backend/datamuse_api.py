import requests


def build_similarity_matrix(tags):
    similarity_matrix = {}
    for tag in tags:
        response = requests.get(
            f"https://api.datamuse.com/words?rel_jja={tag}&max=10")
        if response.status_code == 200:
            similar_words = response.json()
            similarity_matrix[tag] = {
                word_info['word']: word_info['score'] for word_info in similar_words}
        else:
            print(f"Error fetching similar words for tag: {tag}")
    return similarity_matrix
