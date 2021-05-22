const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingDetailSchema = new Schema ({
    from: String,
    to: String,
    date: String,
    airline: String,
    fromTime: String,
    toTime: String,
    passenger : {
         type: Schema.Types.ObjectId,
         ref: "User"
     },
     group: String,
     passengerCount: Number,
     price: Number
});

module.exports = mongoose.model("BookingDetail", bookingDetailSchema);