# DevSearch

Prototype search engine built with NodeJS and Express.

## Prerequisistes

- NodeJS (JavaScript Runtime)
- Typescript (`npm install typescript`)

**For Server-Side Deployment Only:**
- PM2 Node Process Manager (`npm install -g pm2`)

## Setup

Install node packages:
```
npm install
```

Test run web server:
```
npm run webserver
```

Run webscraper:
```
npm run scrape
```

## Deployment

Setup:
```
sudo npm install -g pm2
```

Build:
```
source scripts/build.sh
```

Deploy:
```
source scripts/deploy.sh
```