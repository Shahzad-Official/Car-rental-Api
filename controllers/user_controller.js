const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcrypt");

class UserController {
  static getAllUsers = async (req, res) => {
    User.find()
      .then((doc) => {
        if (doc[0] != null) {
          res.json({ message: "success", data: doc });
        } else {
          console.log(req.cookies.token);
          res.status(403).json({ message: "Data not found!" });
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };
  static updateUser = async (req, res) => {
    const token = req.headers.authorization.split("Bearer ")[1];
    const { id } = jwt.decode(token);
    let filePath;
    if (req.file == null) {
      filePath = req.body.profilePath;
    } else {
      filePath = "user/" + req.file.filename;

      const fileName = req.body.profilePath.split("/")[1];

      fs.unlink(`./public/images/profiles/${fileName}`, (err) => {
        if (err) {
          console.log(`image deleting error=> ${err}`);
        }
      });
    }
    const user = {
      profile: filePath,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phoneCode: req.body.phoneCode,
      phoneNumber: req.body.phoneNumber,
      phoneCountry: req.body.phoneCountry,
    };

    await User.findOneAndUpdate({ _id: id }, user, {
      new: true,
      overwriteDiscriminatorKey: true,
    })
      .then((value) => {
        res.status(201).json({
          message: "Data Updated Successfully",
          data: value,
        });
      })
      .catch((err) => {
        res.status(403).json({ error: err.message });
      });
  };
  static updatePassword = async function (req, res) {
    const { email } = req.body;
    const password = await bcrypt.hash(req.body.password, 10).catch((err) => {
      res.status(400).json({ error: "Password hashing error!" });
    });

    await User.findOneAndUpdate(
      { email: email },
      { password: password },
      { new: true }
    )
      .then((doc) => {
        res.json({message:"Password has been reset successfully!"});
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };
  static updateUserStatus = async function (req, res) {
    const { email , isVerified} = req.body;
 

    await User.findOneAndUpdate(
      { email: email },
      { isVerified: isVerified },
      { new: true,overwriteDiscriminatorKey:true, }
    )
      .then((doc) => {
        if(doc){
          res.json({message:"User status has been updated successfully!"});
        }else{
          res.status(403).json({error:"User not found"});
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };
}
module.exports = UserController;
