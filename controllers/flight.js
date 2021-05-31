const _ = require("lodash");

const BookingDetail = require("../models/bookingDetail"),
    Contact = require("../models/contact");

const airportsList = require("../utils/airportsList"),
    { generateDetails, getCity, sorting } = require("../utils/helperFunctions");


module.exports.index = (req, res) => {
    const airports = airportsList.airports;
    res.render("flights/index", { airports });
}

module.exports.findFlights = (req, res) => {
    const { from, to, date, passengerCount, group } = req.body;
    req.session.details = generateDetails(from.toUpperCase(), to.toUpperCase(), date, parseInt(passengerCount), group);
    res.redirect("/search");
}

module.exports.renderSearch = (req, res) => {
    if (!req.session.details) return res.redirect("/");
    let details = req.session.details;
    details = sorting(details, req.query.sortby);
    res.render("flights/search", { details });
}

module.exports.storeFlightDetails = (req, res) => {
    req.session.detail = JSON.parse(req.body.detail);
    res.redirect("/review");
}

module.exports.renderReview = (req, res) => {
    if (!req.session.detail) return res.redirect("/search");
    const detail = req.session.detail;
    res.render("flights/review", { detail });
}

module.exports.renderTravellerForm = (req, res) => {
    if (!req.session.detail) return res.redirect("/search");
    const detail = req.session.detail;
    res.render("flights/traveller", { detail });
}

module.exports.bookTicket = async (req, res) => {
    if (!req.session.detail) return res.redirect("/search");

    const { passengerCount, passengers } = req.session.detail;
    for (let index = 0; index < passengerCount; index++) {
        let userInput = req.body.group[index] + req.body.fname[index] + " " + req.body.lname[index];
        passengers.push(_.startCase(_.camelCase(userInput)));
    }

    const bookingDetail = new BookingDetail(req.session.detail);
    bookingDetail.user = req.user._id;
    await bookingDetail.save();

    req.flash("success", "Successfully booked the flight!");
    res.redirect("/bookings");
}

module.exports.showBookings = async (req, res) => {
    const details = await BookingDetail.find({ user: req.user._id});
    res.render("flights/bookings", { details, getCity });
}

module.exports.showBoardingPass = async (req, res) => {
    const bookingDetail = await BookingDetail.findById(req.params.id);
    res.render("flights/boarding-pass", { bookingDetail, getCity });
}

module.exports.renderCancel = async (req, res) => {
    const bookingDetail = await BookingDetail.findById(req.params.id);
    res.render("flights/cancel", { bookingDetail, getCity });
}

module.exports.deleteBookings = async (req, res) => {
    const { id, value } = req.params,
        bookingDetail = await BookingDetail.findById(id);

    let passengers = bookingDetail.passengers;
    passengers.splice(value, 1);
    if (passengers.length > 0) {
        await BookingDetail.findByIdAndUpdate(id, { passengers });  
        req.flash("success", "Your Booking has been Cancelled!");
        return res.redirect("/cancel/"+id);      
    }
    await BookingDetail.findByIdAndDelete(id);
    req.flash("success", "Your Booking has been Cancelled!");
    res.redirect("/bookings");
}

module.exports.renderContactForm = (req, res) => {
    res.render("flights/contact");
}

module.exports.saveContactDetails = async (req, res) => {
    const contact = new Contact(req.body);
    await contact.save();
    req.flash("success", "Your message have been sent!");
    res.redirect("/contact");
}
