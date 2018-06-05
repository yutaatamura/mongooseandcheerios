var mongoose = require("mongoose");

//Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//Using Schema constructor, create a new NoteSchema object
var CommentSchema = new Schema({
    body: String
});

//Creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema); 

module.exports = Comment;