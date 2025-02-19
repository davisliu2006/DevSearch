echo "Checking dependencies..."
npm install
echo "Compiling app.ts..."
cd site && npx tsc app.ts --outDir js || echo "site build failed"
cd ..
echo "Compiling scrape.ts..."
cd web_scrape && npx tsc scrape.ts --outDir js || echo "scrape build failed"
cd ..