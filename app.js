const express = require("express");
const app = express();
const ejsMate = require("ejs-mate")
const path = require("path");
const methodOverride = require('method-override')
const Comment = require("./models/comment");
const ExpressError = require("./utils/ExpressError");

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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static("public"));


// Function to catch async error
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err))
    }
}

app.get("/", (req, res) => {
    res.render("page/home");
})

// Add a new comment
app.get("/comments/new", (req, res) => {
    res.render("page/new");
})

app.post("/comments", wrapAsync(async (req, res, next) => {
    if (!req.body.comment) throw new ExpressError("Invalid Comment Schema", 400);
    const comment = new Comment(req.body.comment);
    await comment.save();
    res.redirect(`/comments/${comment._id}`);
}))

// See all comments 
app.get("/comments", async (req, res) => {
    const comments = await Comment.find({});
    res.render("page/index", { comments });
})

// Detail about one comment
app.get("/comments/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) throw new ExpressError("Comment Not Found", 404);
    res.render("page/show", { comment });
}))

// Update a comment
app.get("/comments/:id/edit", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    res.render("page/edit", { comment });
}))

app.put("/comments/:id", wrapAsync(async (req, res, next) => {
    if (!req.body.comment) throw new ExpressError("Invalid Comment Schema", 400);
    const { id } = req.params;
    const comment = await Comment.findByIdAndUpdate(id, { ...req.body.comment }, { runValidators: true, new: true });
    res.redirect(`/comments/${comment._id}`);
}))

// Delete a individual comment
app.delete("/comments/:id", async (req, res) => {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.redirect("/comments")
})

// // Error Handler
app.use((err, req, res, next) => {
    const { message = "Something Went Wrong", status = 500 } = err;
    res.status(status).render("page/error", { err });
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000!");
})