const express = require("express");
const bodyParser = require("body-parser");
const logger = require('morgan');
const mongoose = require("mongoose");
// Parses our HTML and helps us find elements
const cheerio = require("cheerio");
// Makes HTTP request for HTML page
const request = require("request");
//Initialize Express
const app = express();
const port = process.env.PORT || 8989;
const db = require("./models");

// Configure middleware

//Use morgan logger for logging requests
app.use(logger('dev'));
//Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
//Static directory
app.use(express.static(__dirname + "/public/assets"));
//Set engine and default for handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Set up Express Router
const router = express.Router();

// //Require routes files pass router object
require("./routes/apiRoutes")(router);

//Have every request go through router middleware 
app.use(router);

//Connect to Mongo DB 
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongonews";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


//Setup listener 
app.listen(port, function() {
    console.log("Application running on port " + port);
});

