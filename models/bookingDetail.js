const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const bookingDetailSchema = new Schema ({
    from: String,
    to: String,
    date: String,
    airline: String,
    fromTime: String,
    toTime: String,
    user : {
         type: Schema.Types.ObjectId,
         ref: "User"
     },
     group: String,
     passengerCount: Number,
     passengers: Array,
     price: Number
});

module.exports = mongoose.model("BookingDetail", bookingDetailSchema);