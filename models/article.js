const mongoose = require("mongoose");

//Save a reference to the Schema constructor 
const Schema = mongoose.Schema;

//Using the Schema constructor, create a new UserSchema object
//similar to a Sequelize model
const ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    picture: {
        type: String, 
        required: true
        
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    saved: {
        type:Boolean,
        default: false
    },
    comment: [
        {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
    ]
});

//Creates model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

//Export the Article model
module.exports = Article;