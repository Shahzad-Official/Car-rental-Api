const mongoose = require("mongoose");

var brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    createdOn: {
      type: Date,
      default: Date.now(),
    },
    logo: {
      type: String,
      required: true,
    },
    creatorId: {
      type: String,
      default: "",
    },
  },
  { versionKey: false }
);
const Brand = mongoose.model("Brand", brandSchema);
//Export the model
module.exports = Brand;
