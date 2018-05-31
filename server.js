const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// Parses our HTML and helps us find elements
const cheerio = require("cheerio");
// Makes HTTP request for HTML page
const request = require("request");
//Initialize Express
const app = express();
const port = process.env.PORT || 8989;
const db = require("./models");


app.use(bodyParser.urlencoded({ extended: true }));
//Static directory
app.use(express.static(__dirname + "/public/assets"));
//Set engine and default for handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Import routes and give server access 
const router = express.Router();

//Require routes files pass router object
require("./routes")(router);

//Have every request go through router middleware 
app.use(router);

//Connect to Mongo DB 
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongonews";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


//Setup listener 
app.listen(port, function() {
    console.log("Application running on port " + port);
});

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from NYT science page:" +
            "\n***********************************\n");

// Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
request("https://www.nytimes.com/section/science?action=click&contentCollection=health&region=navbar&module=collectionsnav&pagetype=sectionfront&pgtype=sectionfront", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  const $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  const results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("div.story-body").each(function(i, element) {

    // Save the text of the element in a "headline" variable
    const headline = $(element).find("h2").text().trim();

    const summary = $(element).find("p.summary").text().trim();
    const author = $(element).find("p.byline").text().trim();

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    const link = $(element).find("a").attr("href");

    const picture = $(element).find("img").attr("src");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      headline: headline,
      summary: summary,
      author: author,
      link: link,
      picture: picture
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});