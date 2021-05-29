const express = require("express"),
    router = express.Router(),
    passport = require("passport");

const catchAsync = require("../utils/catchAsync");
const auth = require("../controllers/auth");

router.route("/register")
    .get(auth.renderRegister)
    .post(catchAsync(auth.register));

router.route("/login")
    .get(auth.renderLogin)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), auth.login);

router.get("/logout", auth.logout);


module.exports = router;
