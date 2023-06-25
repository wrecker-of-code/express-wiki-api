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
    });

    
app.route("/articles/:searchTitle")
    //// using async/await for resolving the promise
    // .get(async(req, res) => {
    //     const searchTitle = req.params.searchTitle;
    //     try {
    //         const foundDocument = await Article.findOne({ title: searchTitle });
    //         res.status(200).send(foundDocument);
    //     } catch (err) {
    //         res.status(500).send(err);
    //     }
    // })
    .get((req, res) => {
        Article.findOne({ title: req.params.searchTitle }) 
            .then(foundDocument => {
                res.status(200).send(foundDocument);
            })
            .catch(error => {
                res.status(500).send(error);
            });
    })
    .put((req, res) => {
        const updatedDocument = req.body;
        // replaceOne instead of updateOne to make sure the document does not get patched
        Article.replaceOne({ title: req.params.searchTitle }, updatedDocument)
            .then(() => {
                res.status(200).send("Article was replaced successfully.");
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .patch((req, res) => {
        const updatedDocument = req.body;
        Article.updateOne({ title: req.params.searchTitle }, updatedDocument)
            .then(() => {
                res.status(200).send("Article was updated/patched successfully.");
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .delete((req, res) => {
        const searchTitle = req.params.searchTitle;
        Article.deleteOne({ title: searchTitle })
            .then(() => {
                res.status(200).send(`Successfully deleted article with title ${searchTitle}`);
            })
            .catch(err => {
                res.status(500).send(err);
            })
    })




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}, http://localhost:${PORT}/`);
});