const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingDetailSchema = new Schema ({
    from: String,
    to: String,
    date: Date,
    flight: String,
    passenger : {
         type: Schema.Types.ObjectId,
         ref: "User"
     }
});

module.exports = mongoose.model("BookingDetail", bookingDetailSchema);