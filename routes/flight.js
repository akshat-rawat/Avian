const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { generateDetails } = require("../utils/helperFunctions");

router.get("/", (req, res) => {
    res.render("flights/index");
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
    const details = req.session.details;
    res.render("flights/search", { details });
});

router.post("/search", (req, res) => {
    req.session.detail = JSON.parse(req.body.detail);
    res.redirect("/review");
});

router.get("/review", (req, res) => {
    if (!req.session.detail) {
        return res.redirect("/search");
    }
    const detail = req.session.detail;
    res.render("flights/review", { detail });
});

router.get("/list", (req, res) => {
    if (!req.session.detail) {
        return res.redirect("/search");
    }
    const detail = req.session.detail;
    res.render("flights/list", { detail });
});

router.get("/booking", (req, res) => {
    res.render("flights/booking");
});

router.get("/contact", (req, res) => {
    res.render("flights/contact");
});


module.exports = router;
