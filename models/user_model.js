
const { default: mongoose } = require("mongoose");

mongoose;
const userSchema = new mongoose.Schema(
  {
    profile:{
      type:String,
      required:true,
    },
    firstname: {
      required: true,
      type: String,
    },
    lastname: {
      type: String,
      default: "",
    },
    email: {
      required: true,
      unique: true,
      type: String,
    },
    phoneCountry:{
      required:true,
      type:String,
    },
    phoneCode:{
        required:true,
        type:String,
    },
    phoneNumber:{
        required:true,
        type:String,
    },

    password: {
      required: true,
      type: String,
    },
    createdOn:{
     type:Date,
      default:Date.now(),
    },
   
    
  },
  { versionKey: false }
);

// User model
const User = mongoose.model("User", userSchema);
module.exports = User;
