const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); 
const path = require("path");

mongoose.connect("mongodb://localhost:27017/avian", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected")
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/", (req, res) => {
    res.render("home");
})


app.listen(3000, () => {
    console.log("Server live at 3000")
})
