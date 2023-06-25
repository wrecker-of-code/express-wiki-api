require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(`${process.env.MONGO_URI}/wikiDB`);

// setup bodyparser and ejs
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);


app.route("/articles")
    .get((req, res) => {
        Article.find()
        .then(articles => {
            res.send(articles);
        })
        .catch(err => {
            console.log(err);
            res.send("There was an error handling the request.\n" + err);
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        
        newArticle.save()
            .then(info => {
                res.send("200 -> Status ok!\n" + info);
            })
            .catch(error => {
                res.send("404\n" + error);
            })
    })
    .delete((req, res) => {
        Article.deleteMany({})
            .then(() => {
                res.send("Successfully deleted all entries");
            })
            .catch(error => {
                res.send(error);
            })
    })



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}, http://localhost:${PORT}/`);
});