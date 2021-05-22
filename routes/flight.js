const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { generateDetails } = require("../utils/helperFunctions");
const BookingDetail = require("../models/bookingDetail");

router.get("/", (req, res) => {
    res.render("flights/index");
});

router.post("/", (req, res) => {
    const { from, to, date, passengerCount, group } = req.body;
    req.session.details = generateDetails(from, to, date, parseInt(passengerCount), group);
    res.redirect("/search");
});

router.get("/search", (req, res) => {
    if (!req.session.details) return res.redirect("/");
    const details = req.session.details;
    res.render("flights/search", { details });
});

router.post("/search", (req, res) => {
    req.session.detail = JSON.parse(req.body.detail);
    res.redirect("/review");
});

router.get("/review", (req, res) => {
    if (!req.session.detail) return res.redirect("/search");
    const detail = req.session.detail;
    res.render("flights/review", { detail });
});

router.post("/review", async (req, res) => {
    if (!req.session.detail) return res.redirect("/search");

    const bookingDetail = new BookingDetail(req.session.detail);
    bookingDetail.passenger = req.user._id;
    await bookingDetail.save();

    req.flash("success", "Successfully booked the flight!");
    res.redirect("/bookings");
});

router.get("/bookings", (req, res) => {
    if (!req.user) return res.redirect("/login");

    BookingDetail.find({ passenger: req.user._id}, function (err, details) {
        if (err){
            console.log(err);
        }
        else{
            res.render("flights/bookings", { details });
        }
    });
});

router.get("/boarding-pass/:id", async (req, res) => {
    const bookingDetail = await BookingDetail.findById(req.params.id).populate("passenger");
    res.render("flights/boarding-pass", { bookingDetail });
});

router.get("/contact", (req, res) => {
    res.render("flights/contact");
});


module.exports = router;
