npm install
cd site && npx tsc app.ts --outDir js || echo "site build failed"
cd ..
cd web_scrape && npx tsc scrape.ts --outDir js || echo "scrape build failed"
cd ..