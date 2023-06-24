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
app.set("view engine", "ejs");














app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}, localhost:${PORT} or http://localhost:${PORT}/`);
});