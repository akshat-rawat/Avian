const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); 
const path = require("path");


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
