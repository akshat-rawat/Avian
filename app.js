if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config();
}

const express = require("express"),
    mongoose = require("mongoose"),
    ejsMate = require("ejs-mate"),
    path = require("path"),
    session = require("express-session"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    mongoSanitize = require("express-mongo-sanitize"),
    helmet = require("helmet"),
    MongoStore = require("connect-mongo");

const User = require("./models/user");

const flightRoutes = require("./routes/flight");
const authRoutes = require("./routes/auth");

const dbUrl = process.env.dbURL || "mongodb://localhost:27017/avian";
mongoose.connect(dbUrl, {
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

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: process.env.dbSECRET,
    touchAfter: 24*60*60
});
store.on("error", function (err) {
    console.log("Session Store Error", err);
});

const sessionConfig = {
    store,
    name: "sesh",
    secret: process.env.seshSECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));

app.use(mongoSanitize());
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (req.originalUrl !== "/login") req.session.returnTo = req.originalUrl;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/", flightRoutes);
app.use("/", authRoutes);

app.all("*", (req, res, next) => {
    res.redirect("/");
});

app.use((err, req, res, next) => {
    console.log(err.message);
    req.flash("error", "Oh No, Something Went Wrong!");
    res.redirect("/");
});


const port = process.env.PORT || "3000";
app.listen(port, () => {
    console.log(`Server live at ${port}`);
});