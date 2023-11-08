def find_most_relevant_keyword(keyword_watch_data, similarity_matrix):
    keyword_scores = {}
    for keyword, watch_time in keyword_watch_data.items():
        similar_words = similarity_matrix.get(keyword, {})
        for similar_word, score in similar_words.items():
            if similar_word not in keyword_watch_data:
                keyword_scores[similar_word] = keyword_scores.get(
                    similar_word, 0) + (score * watch_time)
    most_relevant_keyword = max(
        keyword_scores, key=keyword_scores.get) if keyword_scores else None
    return most_relevant_keyword, keyword_scores.get(most_relevant_keyword, 0)
