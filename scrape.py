import requests
from bs4 import BeautifulSoup
import re
import os
from urllib.parse import urljoin

url = 'https://www.justmylook.com/'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

print("Fetching justmylook.com...")
try:
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
except Exception as e:
    print(f"Error fetching page: {e}")
    exit(1)

soup = BeautifulSoup(response.text, 'html.parser')
images = soup.find_all('img')

img_urls = []
for img in images:
    src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
    if src:
        full_url = urljoin(url, src)
        if re.search(r'\.(jpg|jpeg|png|webp|gif)', full_url, re.I):
            img_urls.append(full_url)

# De-duplicate while preserving order
seen = set()
unique_urls = []
for u in img_urls:
    if u not in seen:
        seen.add(u)
        unique_urls.append(u)

print(f"Found {len(unique_urls)} images.")

if not unique_urls:
    print("No images found. Exiting.")
    exit(1)

html_path = 'index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

broken_links = re.findall(r'https://lh3\.googleusercontent\.com[^\"]+', html_content)
print(f"Found {len(broken_links)} broken links to replace.")

if len(broken_links) > 0:
    for i, broken in enumerate(broken_links):
        replacement = unique_urls[i % len(unique_urls)]
        html_content = html_content.replace(broken, replacement, 1)
        
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("Replaced broken links with downloaded image URLs in index.html.")
else:
    print("No broken links found in index.html.")
