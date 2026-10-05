import urllib.request, urllib.parse, re

brands = ['Beauty of Joseon', 'COSRX', 'Anua', 'SKIN1004', 'Round Lab', 'Isntree']
for b in brands:
    try:
        url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(b + ' logo filetype:png')
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        matches = re.findall(r'src=\"(https?://[^\"]+\.png.*?)\"', html)
        if matches:
            print(f'{b}: {matches[0]}')
        else:
            print(f'{b}: No matches')
    except Exception as e:
        print(f'{b}: error {e}')
