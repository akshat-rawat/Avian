const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); 
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");
const flightRoutes = require("./routes/flight");
const authRoutes = require("./routes/auth");

mongoose.connect("mongodb://localhost:27017/avian", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Connected")
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true}));

const sessionConfig = {
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", flightRoutes);
app.use("/", authRoutes);


app.listen(3000, () => {
    console.log("Server live at 3000")
})
