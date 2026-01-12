#!/usr/bin/env python3
import requests
import json
import os

# Configuration
ADS_API_KEY = os.environ.get('ADS_API_KEY', 'TUhSWd2xbsM6sSP9zVdvZBVNgYmS0m188x1mlKup')
ADS_API_URL = 'https://api.adsabs.harvard.edu/v1/search/query'
AUTHOR_NAME = 'Rhea, Carter'

def fetch_publications():
    """Fetch publications from ADS API"""
    params = {
        'q': f'author:"{AUTHOR_NAME}"',
        'fl': 'title,author,year,pubdate,bibcode,citation_count,abstract,pub,first_author,doctype',
        'rows': 200,
        'sort': 'date desc'
    }

    headers = {
        'Authorization': f'Bearer {ADS_API_KEY}',
        'Content-Type': 'application/json'
    }

    try:
        response = requests.get(ADS_API_URL, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()

        publications = []
        for doc in data['response']['docs']:
            pub = {
                'title': doc.get('title', ['Untitled'])[0],
                'authors': doc.get('author', []),
                'year': doc.get('year'),
                'date': doc.get('pubdate'),
                'bibcode': doc.get('bibcode'),
                'citations': doc.get('citation_count', 0),
                'abstract': doc.get('abstract', ''),
                'journal': doc.get('pub', 'Unknown'),
                'isFirstAuthor': doc.get('first_author') == AUTHOR_NAME,
                'doctype': doc.get('doctype', 'article'),
                'adsUrl': f"https://ui.adsabs.harvard.edu/abs/{doc.get('bibcode')}/abstract"
            }

            # Calculate author position
            if pub['authors']:
                try:
                    author_index = next(i for i, author in enumerate(pub['authors']) if 'Rhea' in author)
                    pub['authorPosition'] = author_index + 1
                except StopIteration:
                    pub['authorPosition'] = -1
            else:
                pub['authorPosition'] = -1

            publications.append(pub)

        # Save to JSON file
        output_dir = 'data'
        os.makedirs(output_dir, exist_ok=True)

        output_file = os.path.join(output_dir, 'publications.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(publications, f, indent=2, ensure_ascii=False)

        print(f"Successfully fetched {len(publications)} publications")
        return publications

    except requests.exceptions.RequestException as e:
        print(f"Error fetching publications: {e}")
        return []

if __name__ == '__main__':
    fetch_publications()
