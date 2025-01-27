npm install
cd site && tsc app.ts --outDir js || echo "site build failed"
cd ..
cd web_scrape && tsc scrape.ts --outDir js || echo "scrape build failed"