const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);