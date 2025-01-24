import requests
import bs4
import json

class JobInfo:
    def __init__(self, url=None, classification=None):
        self.url: str = url
        self.classification: list[tuple[str,list[str]]] = classification
    def get_tags(self):
        tags: list[str] = []
        for name, keywords in self.classification:
            tags.append(name)
        return tags

def classify(html: str):
    soup = bs4.BeautifulSoup(html, "html.parser")
    textElems: list[bs4.Tag] = soup.find_all(["h1", "h2", "h3", "h4", "h5", "p"])
    val = []
    categories = [
        ("software", ["software"]),
        ("web", ["web", "web-dev"]),
        ("frontend", ["frontend", "front-end", "front end"]),
        ("backend", ["backend", "back-end", "back end"]),
        ("embedded", ["embedded", "firmware"]),
        ("system", ["operating system"]),
        ("c++", ["c++"]),
        ("java", ["java"]),
        ("javascript", ["javascript", "typescript"]),
        ("c#", ["c#", ".net"])
    ]
    for name, keywords in categories:
        flag = False
        for elem in textElems:
            elemText = elem.decode_contents().strip()
            for i in range(0, len(elemText)):
                for keyword in keywords:
                    if i+len(keyword) <= len(elemText) and elemText[i : i+len(keyword)].lower() == keyword.lower():
                        val.append((name, keywords))
                        flag = True
                        break
                if flag: break
            if flag: break;
    return val

def scrape(targetUrls, domainMatch):
    def is_domainMatch(url: str):
        if url[0:4] != "http": return False
        for match in domainMatch:
            if url.find(match) != -1: return True
        return False
        
    subUrls: list[str] = []
    for url in targetUrls:
        req = requests.get(url)
        html = req.text
        print(html)
        soup = bs4.BeautifulSoup(html, "html.parser")
        links: list[bs4.Tag] = soup.find_all("a")
        for i, link in enumerate(links):
            subUrl: str = link.get("href")
            if subUrl and is_domainMatch(subUrl):
                print(f"{i+1}/{len(links)}: {subUrl}")
                subUrls.append(subUrl);
    print(f"{len(subUrls)} sites found")

    jobsFound: list[JobInfo] = []
    for i, url in enumerate(subUrls):
        print(f"Scraping {i+1}/{len(subUrls)}... ({url})")
        req = requests.get(url)
        html = req.text
        classification = classify(html)
        ji = JobInfo(url, classification)
        jobsFound.append(ji)
        
    for ji in jobsFound:
        print(ji.url, ji.get_tags())

def main():
    targetUrls = [
        "https://www.linkedin.com/jobs/search?keywords=software"
    ]
    domainMatch = [
        "www.linkedin.com/jobs"
    ]
    scrape(targetUrls, domainMatch)
    with open("data.json") as json_data:
        pass
        

if __name__ == "__main__":
    main()