const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UserController {
  static getAllUsers = async (req, res) => {
   User.find().then((doc)=>{
    if(doc[0]!=null){
      res.json({message:"success",data:doc});
    }else{
      console.log(req.cookies.token);
      res.status(403).json({message:"Data not found!"});
    }

   }).catch((err)=>{res.status(500).json(err);});
  };
}
module.exports = UserController;
