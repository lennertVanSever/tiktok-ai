import re
from urllib.parse import urlparse


def extract_tags_from_url(url):
    # List of common words to ignore
    stopwords = {
        'a', 'the', 'in', 'of', 'to', 'and', 'with', 'over', 'for', 'on', 'is', 'by', 'this', 'from', 'at', 'or', 'an',
        'be', 'as', 'video', 'com', 'www', 'http', 'https', 'its'
    }
    # Parse the URL to get the path
    path = urlparse(url).path
    # Extract the descriptive part of the path and replace hyphens with spaces
    descriptive_parts = re.split(r'[-/]', path)
    # Filter out stopwords and numbers
    tags = [part for part in descriptive_parts if part and part.lower()
            not in stopwords and not part.isdigit()]

    return tags


# Example usage
url = "https://www.pexels.com/video/a-cloud-of-blue-green-paint-underwater-7565438/"
tags = extract_tags_from_url(url)
# Print each tag on a new line
print("\n".join(tags))
