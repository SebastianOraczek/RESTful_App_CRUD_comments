const Comment = require("../models/comment");
const { usernames, comments } = require("./users_and_comments");

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/RESTful_Project', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});


// Creating 6 fake comments
const addComment = async () => {
    await Comment.deleteMany({});

    for (let i = 0; i < usernames.length; i++) {
        const comment = new Comment({
            username: usernames[i],
            text: comments[i]
        })
        await comment.save();
    }
}


// Closing connection with DB
addComment().then(() => {
    mongoose.connection.close();
})