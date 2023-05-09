const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UserController {
  static getAllUsers = async (req, res) => {
   User.find().then((doc)=>{
    res.json({message:"success",data:doc});

   }).catch((err)=>{res.status(500).json(err);});
  };
}
module.exports = UserController;
