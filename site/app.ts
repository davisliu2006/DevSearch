import * as express from "express";

let app = express();
app.set("view engine", "ejs");
app.set("views", __dirname+"/views");
app.use(express.static(__dirname + "/static"));

app.get("/", function(req, res) {
    res.redirect("/index");
});
app.get("/index", function(req, res) {
    let searchQuery = req.query["query"];
    res.render("index.ejs", {searchQuery});
});

app.get("/query", function(req, res) {
    
});
app.get("/*", function(req, res) {
    let params = req.params;
    res.render("404.ejs", {params});
});

app.listen(3000);