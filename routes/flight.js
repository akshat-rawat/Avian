const express = require("express");
const router = express.Router();
const _ = require("lodash");
const passport = require("passport");

const BookingDetail = require("../models/bookingDetail");
const Contact = require("../models/contact");

const catchAsync = require("../utils/catchAsync");
const { generateDetails, getCity } = require("../utils/helperFunctions");
const { isLoggedIn, validateSearchData, validateBookingId } = require("../utils/middlewares");
const airportsList = require("../utils/airportsList");

router.get("/", (req, res) => {
    const airports = airportsList.airports
    res.render("flights/index", { airports });
});

router.post("/", validateSearchData, (req, res) => {
    const { from, to, date, passengerCount, group } = req.body;
    req.session.details = generateDetails(from.toUpperCase(), to.toUpperCase(), date, parseInt(passengerCount), group);
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

router.get("/traveller", (req, res) => {
    if (!req.session.detail) return res.redirect("/search");
    const detail = req.session.detail
    res.render("flights/traveller", { detail });
});

router.post("/traveller", isLoggedIn, async (req, res) => {
    if (!req.session.detail) return res.redirect("/search");

    const { passengerCount, passengers } = req.session.detail
    for (let index = 0; index < passengerCount; index++) {
        let userInput = req.body.group[index] + req.body.fname[index] + " " + req.body.lname[index];
        passengers.push(_.startCase(_.camelCase(userInput)));
    }

    const bookingDetail = new BookingDetail(req.session.detail);
    bookingDetail.user = req.user._id;
    await bookingDetail.save();

    req.flash("success", "Successfully booked the flight!");
    res.redirect("/bookings");
});

router.get("/bookings", isLoggedIn, (req, res) => {
    BookingDetail.find({ user: req.user._id}, function (err, details) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("flights/bookings", { details, getCity });
        }
    });
});

router.get("/boarding-pass/:id", validateBookingId, async (req, res) => {
    const bookingDetail = await BookingDetail.findById(req.params.id);
    res.render("flights/boarding-pass", { bookingDetail, getCity });
});

router.get("/cancel/:id", isLoggedIn, validateBookingId, async (req, res) => {
    const bookingDetail = await BookingDetail.findById(req.params.id);
    res.render("flights/cancel", { bookingDetail, getCity });
});

router.post("/cancel/:id/:value", isLoggedIn, validateBookingId, passport.authenticate("local", { failureFlash: true, failureRedirect: "/bookings" }), async (req, res) => {
    const { id, value } = req.params;
    const bookingDetail = await BookingDetail.findById(id);

    let passengers = bookingDetail.passengers;
    passengers.splice(value, 1);
    
    if (passengers.length > 0) {
        BookingDetail.findByIdAndUpdate(id, { passengers }, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                req.flash("success", "Your Booking has been Cancelled!");
                res.redirect("/cancel/"+id);
            }
        });        
    } else {
        BookingDetail.findByIdAndDelete(id, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                req.flash("success", "Your Booking has been Cancelled!");
                res.redirect("/bookings");
            }
        });        
    }
});

router.get("/contact", (req, res) => {
    res.render("flights/contact");
});

router.post("/contact", async (req, res) => {
    const contact = new Contact(req.body);
    await contact.save();
    
    req.flash("success", "Your message have been sent.");
    res.redirect("/contact");
});


module.exports = router;
