const express = require("express");
const db = require("../models");
const request = require("request");
const cheerio = require("cheerio");
//Axios is a promise-based http library, similar to jQuery's AJAX method; works on the client and on the server
const axios = require("axios");

module.exports = function(router){

router.get("/scrape", function(req, res) {
    
    // First, tell the console what server.js is doing
console.log("\n***********************************\n" +
"Grabbing every thread name and link\n" +
"from NYT science page:" +
"\n***********************************\n");

//Grab body of the html with request 
axios.get("https://www.nytimes.com/section/science?action=click&contentCollection=health&region=navbar&module=collectionsnav&pagetype=sectionfront&pgtype=sectionfront")
.then(function(response) {

// Load the HTML into cheerio and save it to a variable
// '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
const $ = cheerio.load(response.data);

// An empty array to save the data that we'll scrape
const results = {};

// With cheerio, find each p-tag with the "title" class
// (i: iterator. element: the current element)
$("div.story-body").each(function(i, element) {

// Save the text of the element in a "headline" variable
results.headline = $(element).find("h2").text().trim();

results.summary = $(element).find("p.summary").text().trim();
results.author = $(element).find("p.byline").text().trim();

results.link = $(element).find("a").attr("href");

results.picture = $(element).find("img").attr("src");

// Save these results in an object that we'll push into the results array we defined earlier
// results.push({
// headline: headline,
// summary: summary,
// author: author,
// link: link,
// picture: picture
// });
// });

// Log the results once you've looped through each of the elements found with cheerio
// console.log(results);

db.Article.create(results)
.then(function(dbArticle) {
    console.log(dbArticle);
})
.catch(function(err) {
    return res.json(err);
    });
});

res.send("Scrape Complete");
})

});

router.get("/", function(req, res) {

        res.render("index");
    });

}


