import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import {JobData, JobInfo, tagCategories, DomainInfo} from "../include/types";

const DIR = process.cwd();

function classify($: cheerio.CheerioAPI, domainInfo: DomainInfo | null): Array<string> {
    if (!domainInfo) {return [];}
    let desc = $(domainInfo.description);
    let val: Array<string> = [];
    let categories: Array<[string, Array<string>]> = tagCategories;
    for (let [name, keywords] of categories) {
        let flag = false;
        let descText = desc.text();
        for (let i = 0; i < descText.length; i++) {
            for (let keyword of keywords) {
                if (i+keyword.length <= descText.length
                && descText.substring(i, i+keyword.length).toLowerCase() == keyword.toLowerCase()) {
                    val.push(name);
                    flag = true;
                    break;
                }
            }
            if (flag) {break;}
        }
    }
    return val;
}

async function scrape(targetUrls: Array<string>, domainMatch: Array<DomainInfo>): Promise<Array<JobInfo>> {
    function get_domainMatch(url: string) {
        if (url.substring(0, 4) != "http") {return null;}
        for (let match of domainMatch) {
            if (url.includes(match.url)) {return match;}
        }
        return null;
    }

    const SCRAPE_LIMIT = 10000;
    let subUrls: Array<string> = [];
    for (let url of targetUrls) {
        let req = await axios.get(url);
        let html: string = req.data;
        const $ = cheerio.load(html);
        let linkElems = $("a[href]");
        for (let i = 0; i < linkElems.length; i++) {
            let subUrl = linkElems[i].attribs["href"].split("?")[0];
            if (get_domainMatch(subUrl) && subUrls.length < SCRAPE_LIMIT) {
                console.log(i+1+"/"+linkElems.length+": "+subUrl);
                subUrls.push(subUrl);
            }
        }
    }
    console.log(`${subUrls.length} sites found`);

    let jobsFound: Array<JobInfo> = [];
    for (let i = 0; i < subUrls.length; i++) {
        let url = subUrls[i];
        console.log(`Scraping... ${url}`);
        try {
            let req = await axios.get(url);
            let html: string = req.data;
            let $ = cheerio.load(html);
            let title = $("title").text();
            let classification = classify($, get_domainMatch(url));
            let ji = new JobInfo(title, url, classification);
            jobsFound.push(ji);
        } catch {
            console.log("Scrape failed.");
        }
    }
    for (let i = 0; i < jobsFound.length; i++) {
        let ji = jobsFound[i];
        console.log(`${i+1}/${jobsFound.length} ${ji.title} ${ji.url} [${ji.classification}]`);
    }
    return jobsFound;
}

async function main() {
    let targetUrls = [
        "https://www.linkedin.com/jobs/search?keywords=software",
        "https://www.linkedin.com/jobs/search?keywords=computer"
    ];
    let domainMatch: Array<DomainInfo> = JSON.parse(
        fs.readFileSync(DIR+"/scrape-domains.json", "utf-8")
    ).domains;
    try {
        let jobsFound = await scrape(targetUrls, domainMatch);
        let write = JSON.stringify(new JobData(jobsFound));
        fs.writeFileSync(DIR+"/../data/scrape.json", write);
    } catch {
        console.log("An error occurred.");
    }
}
main()