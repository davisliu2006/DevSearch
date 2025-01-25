import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import {JobData, JobInfo} from "../include/types";

console.log("hi");

function classify(html: string): Array<string> {
    let $ = cheerio.load(html);
    let textElems = $("h1, h2, h3, h4, h5, p");
    let val: Array<string> = [];
    let categories: Array<[string, Array<string>]> = [
        ["software", ["software"]],
        ["web", ["web", "web-dev"]],
        ["frontend", ["frontend", "front-end", "front end"]],
        ["backend", ["backend", "back-end", "back end"]],
        ["embedded", ["embedded", "firmware"]],
        ["system", ["operating system"]],
        ["c++", ["c++"]],
        ["java", ["java"]],
        ["javascript", ["javascript", "typescript"]],
        ["c#", ["c#", ".net"]]
    ]
    for (let [name, keywords] of categories) {
        let flag = false;
        let elemText = textElems.text();
        for (let i = 0; i < elemText.length; i++) {
            for (let keyword of keywords) {
                if (i+keyword.length <= elemText.length
                && elemText.substring(i, i+keyword.length).toLowerCase() == keyword.toLowerCase()) {
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

async function scrape(targetUrls: Array<string>, domainMatch: Array<string>): Promise<Array<JobInfo>> {
    function is_domainMatch(url: string) {
        if (url.substring(0, 4) != "http") {return false;}
        for (let match of domainMatch) {
            if (url.includes(match)) {return true;}
        }
        return false;
    }

    let subUrls: Array<string> = [];
    for (let url of targetUrls) {
        let req = await axios.get(url);
        let html: string = req.data;
        const $ = cheerio.load(html);
        let linkElems = $("a[href]");
        for (let i = 0; i < linkElems.length; i++) {
            let subUrl = linkElems[i].attribs["href"].split("?")[0];
            if (is_domainMatch(subUrl)) {
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
        let req = await axios.get(url);
        let html: string = req.data;
        let classification = classify(html);
        let ji = new JobInfo(url, classification);
        jobsFound.push(ji);
    }
    for (let i = 0; i < jobsFound.length; i++) {
        let ji = jobsFound[i];
        console.log(`${i+1}/${jobsFound.length} ${ji.url} ${ji.classification}`);
    }
    return jobsFound;
}

async function main() {
    let targetUrls = [
        "https://www.linkedin.com/jobs/search?keywords=software",
        "https://www.linkedin.com/jobs/search?keywords=computer"
    ];
    let domainMatch = [
        "www.linkedin.com/jobs"
    ];
    let jobsFound = await scrape(targetUrls, domainMatch);
    let write = JSON.stringify(new JobData(jobsFound));
    fs.writeFileSync("data/scrape.json", write);
}
main()