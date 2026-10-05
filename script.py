import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'(<section[^>]*class="[^"]*)py-\d+', r'\1py-1', content)
content = re.sub(r'(<section[^>]*class="[^"]*)pt-\d+', r'\1pt-1', content)
content = re.sub(r'(<section[^>]*class="[^"]*)pb-\d+', r'\1pb-1', content)
content = re.sub(r'(<h2[^>]*class="[^"]*)mb-\d+', r'\1mb-1', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
