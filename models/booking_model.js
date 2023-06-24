const mongoose = require("mongoose");
var bookingSchema = new mongoose.Schema(
  {
    carId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },

    bookedOn: {
      type: String,
      required: true,
    },
    expiredOn: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  { versionKey: false }
);

const Bookings = mongoose.model("Bookings", bookingSchema);
module.exports = Bookings;
