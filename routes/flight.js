const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { generateDetails } = require("../utils/helperFunctions");

router.get("/", (req, res) => {
    res.render("home");
});

router.post("/", (req, res) => {
    const { from, to, date, passengerCount, group } = req.body;
    req.session.details = generateDetails(from, to, date, passengerCount, group);
    res.redirect("/search");
});

router.get("/search", (req, res) => {
    if (!req.session.details) {
        return res.redirect("/");
    }
    res.send(req.session.details);
});


module.exports = router;
