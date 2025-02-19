import * as express from "express";
import * as fs from "fs";
import {JobData, JobInfo, tagCategories} from "../include/types";
import * as lib from "../include/lib";

const DIR = process.cwd();

let app = express();
app.set("view engine", "ejs");
app.set("views", DIR+"/views");
app.use(express.static(DIR+"/static"));

app.get("/", function(req, res) {
    res.redirect("/index");
});
app.get("/index", function(req, res) {
    let categories = tagCategories;
    res.render("index.ejs", {categories});
});

app.get("/search", function(req, res) {
    let searchQuery = req.query["query"];
    let searchTags = (typeof(req.query["tags"]) == "string"? req.query["tags"].split(' ') : undefined);
    let searchData: Array<JobInfo> = [];
    let categories = tagCategories;
    if (typeof(searchQuery) == "string") {
        let queryTokens = searchQuery.split(' ');
        let read = fs.readFileSync(DIR+"/../data/scrape.json", "utf8");
        let jobData: JobData = JSON.parse(read);
        for (let item of jobData.jobsFound) {
            let title = item.title.toLowerCase();
            let url = item.url.toLowerCase();
            let urlRoot = url.split("?")[0];
            if (searchTags) {
                let flag = false;
                for (let tag of searchTags) {
                    if (item.classification.includes(tag)) {flag = true;}
                }
                if (!flag) {continue;}
            }
            for (let token of queryTokens) {
                token = token.toLowerCase();
                if (token.length >= 2 && token[0] == '"' && token[token.length-1] == '"') {
                    let innerToken = token.substring(1, token.length-1);
                    if (lib.split_by_words(urlRoot).includes(innerToken)) {
                        searchData.push(item);
                        break;
                    } else if (lib.split_by_words(title).includes(innerToken)) {
                        searchData.push(item);
                        break;
                    } else if (item.classification.includes(innerToken)) {
                        searchData.push(item);
                        break;
                    }
                } else {
                    if (urlRoot.includes(token)) {
                        searchData.push(item);
                        break;
                    } else if (title.includes(token)) {
                        searchData.push(item);
                        break;
                    } else if (item.classification.includes(token)) {
                        searchData.push(item);
                        break;
                    }
                }
            }
        }
    } else {
        searchQuery = "";
    }
    if (searchData.length > 100) {
        searchData.length = 100;
    }
    res.render("search.ejs", {searchQuery, searchTags, searchData, categories});
});

app.get("/about", function(req, res) {
    res.render("about.ejs");
});

app.get("/login", function(req, res) {
    res.render("login.ejs");
})

app.get("/*", function(req, res) {
    let params = req.params;
    res.render("404.ejs", {params});
});

app.listen(3000);