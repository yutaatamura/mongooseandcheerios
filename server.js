// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from NYT science page:" +
            "\n***********************************\n");

// Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
request("https://www.nytimes.com/section/science?action=click&contentCollection=health&region=navbar&module=collectionsnav&pagetype=sectionfront&pgtype=sectionfront", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("div.story-body").each(function(i, element) {

    // Save the text of the element in a "headline" variable
    var headline = $(element).find("h2").text().trim();

    var summary = $(element).find("p.summary").text().trim();
    var author = $(element).find("p.byline").text().trim();

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).find("a").attr("href");

    var picture = $(element).find("img").attr("src");

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