const BookingDetail = require("../models/bookingDetail");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.validateBookingId = (req, res, next) => {
    BookingDetail.exists({ _id: req.params.id }, function(err, result) {
        if (!err) { if (result) return next(); }
        req.flash("error", "Invalid Boarding Pass");
        res.redirect("/bookings");
    });
}