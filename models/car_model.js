const mongoose = require("mongoose");

var carSchema = new mongoose.Schema({
  carname: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  featureImages: {
    default: [],
  },
  brandId: {
    type: String,
    required: true,
  },
  noOfSeats: {
    type: String,
    required: true,
  },
  maxSpeed: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pricePerDay: {
    type: String,
    required: true,
  },
  priceHalfWeek: {
    type: String,
    required: true,
  },
  pricePerWeek: {
    type: String,
    required: true,
  },
  creatorId: {
    default: "",
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

const Car = mongoose.model("Cars", carSchema);
module.exports = Car;
