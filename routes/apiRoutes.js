const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const db = require("../models");
//Axios is a promise-based http library, similar to jQuery's AJAX method; works on the client and on the server
const axios = require("axios");

module.exports = function(router){

router.get("/", function(req, res) {
    db.Article.find({}, null, {sort: {created: -1}}, function(err, data) {
        if (data) {
            res.render("index", {articles: data});
        } else {
            res.json(err);
        }
    });
   
});

router.get("/scrape", function(req, res) {
    
    // First, tell the console what server.js is doing
console.log("\n***********************************\n" +
"Grabbing every thread name and link\n" +
"from NYT science page:" +
"\n***********************************\n");

//Grab body of the html with request 
axios.get("https://www.nytimes.com/section/science")
.then(function(response) {

// Load the HTML into cheerio and save it to a variable
// '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
let $ = cheerio.load(response.data);

// With cheerio, find each p-tag with the "title" class
// (i: iterator. element: the current element)
$("section.latest-panel").find("div.story-body").each(function(i, element) {
// An empty array to save the data that we'll scrape

let results = [];
// Save the text of the element in a "headline" variable
const headline = $(this).find("h2").text().trim();
const summary = $(this).find("p.summary").text().trim();
const author = $(this).find("p.byline").text().trim();
const link = $(this).find("a").attr("href");
const picture = $(this).find("img").attr("src");

// Save these results in an object that we'll push into the results array we defined earlier
results.push({
headline: headline,
summary: summary,
author: author,
link: link,
picture: picture
});
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

console.log("Scrape Complete");
res.redirect("/");
});

});


router.get("/articles/:id", function(req, res) {
    db.Article.findOne({
        _id: req.params.id
    })
    .populate("comment")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});


router.post("/note/:id", function(req, res) {

    let id = req.params.id;

    db.Comment.create(req.body)
    .then(function(dbComment) {
        return db.Article.findOneAndUpdate({ 
            _id: id 
        }, {
            comment: dbComment._id
        }, {
            new: true
        });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});


router.delete('/note/:id', function(req, res ) {
    let id = req.params.id;

    db.Comment.remove({
        _id: id
    })
    .then(function(dbComment) {
        res.json({message: "Comment removed!"})
    })
    .catch(function(err) {
        res.json(err);
    });
});


}


