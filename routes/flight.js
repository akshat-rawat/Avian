const express = require("express"),
    router = express.Router(),
    _ = require("lodash"),
    passport = require("passport");

const catchAsync = require("../utils/catchAsync"),
    { isLoggedIn, validateSearchData, validateBookingId } = require("../utils/middlewares");

const flight = require("../controllers/flight");

router.route("/")
    .get(flight.index)
    .post(validateSearchData, flight.findFlights);

router.route("/search")
    .get(flight.renderSearch)
    .post(flight.storeFlightDetails);

router.route("/review")
    .get(flight.renderReview);

router.route("/traveller")
    .get(flight.renderTravellerForm)
    .post(isLoggedIn, catchAsync(flight.bookTicket)); 

router.route("/bookings")
    .get(isLoggedIn, catchAsync(flight.showBookings));

router.route("/boarding-pass/:id")
    .get(validateBookingId, catchAsync(flight.showBoardingPass));

router.route("/cancel/:id")
    .get(isLoggedIn, validateBookingId, catchAsync(flight.renderCancel));

router.route("/cancel/:id/:value")
    .post(isLoggedIn, validateBookingId, passport.authenticate("local", { failureFlash: true, failureRedirect: "/bookings" }), catchAsync(flight.deleteBookings));

router.route("/contact")
    .get(flight.renderContactForm)
    .post(catchAsync(flight.saveContactDetails)); 


module.exports = router;
