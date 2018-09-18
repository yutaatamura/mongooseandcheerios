const mongoose = require("mongoose");

//Save a reference to the Schema constructor
const Schema = mongoose.Schema;

//Using Schema constructor, create a new NoteSchema object
const CommentSchema = new Schema({
    body: {
        type: String,
        required: true
},
    timestamp: {
        type: Date,
        default: Date.now
    }
});

//Creates our model from the above schema, using mongoose's model method
const Comment = mongoose.model("Comment", CommentSchema); 

module.exports = Comment;