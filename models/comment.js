const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = Schema({
    username: {
        type: String,
        minLength: 3,
        maxLength: 9,
        required: true

    },
    text: {
        type: String,
        minLength: 2,
        required: true
    }
})

module.exports = mongoose.model("Comment", CommentSchema);