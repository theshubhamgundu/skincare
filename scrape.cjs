const https = require('https');
const fs = require('fs');
const path = require('path');

const targetUrl = 'https://www.justmylook.com/';
const publicImagesDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

https.get(targetUrl, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    // Basic regex to find image sources
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    const urls = [];
    while ((match = imgRegex.exec(data)) !== null) {
      let src = match[1];
      if (src.startsWith('//')) src = 'https:' + src;
      else if (src.startsWith('/')) src = 'https://www.justmylook.com' + src;
      if (src.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
        urls.push(src);
      }
    }
    
    // De-duplicate URLs
    const uniqueUrls = [...new Set(urls)].filter(url => url.startsWith('http'));
    console.log(`Found ${uniqueUrls.length} unique images on justmylook.com.`);
    
    // We only need as many as there are broken links in index.html
    const htmlPath = path.join(__dirname, 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    const brokenImgRegex = /https:\/\/lh3\.googleusercontent\.com[^\"]+/g;
    const brokenMatches = htmlContent.match(brokenImgRegex) || [];
    console.log(`Found ${brokenMatches.length} broken Google images in index.html`);
    
    if (uniqueUrls.length === 0) {
      console.log('No images found on justmylook.com. Exiting.');
      return;
    }

    // Replace broken URLs in index.html with downloaded/scraped URLs
    let replacementIndex = 0;
    htmlContent = htmlContent.replace(brokenImgRegex, () => {
        const replacement = uniqueUrls[replacementIndex % uniqueUrls.length];
        replacementIndex++;
        return replacement;
    });

    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log('Updated index.html with new image URLs.');
  });
}).on('error', err => {
  console.log('Error fetching justmylook.com:', err.message);
});
