require("dotenv").config();
const nodeMailer = require("nodemailer");
const otpGen = require("otp-generator");
const User = require("../models/user_model");
const accountSid = "ACbe892f43a36868cc64665bdf27924c0d";
const authToken = "7c5546d4205aa06c788ffd803e26f288";
const verifySid = "VAc5abde583b75bcf70b854534c8d5cb51";
const client = require("twilio")(accountSid, authToken);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

let transporter = nodeMailer.createTransport({
  host: process.env.SMTP,
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});
class RegistrationController {
  static sendOTP = async (req, res) => {
    const otp = otpGen.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const mailOptions = {
      from: process.env.EMAIL, // sender address
      to: req.body.email,
      subject: "OTP Verification", // Subject line
      html:
        '<h3 style="color:grey;text-align: center;">Please verify given 6 digit otp.</h3> <h2 style="text-align: center;">' +
        otp +
        "</h2>", // plain text body
    };

    await transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        res.json({ message: "Some error occured!", error: err });
        console.log(err);
      }
      res.json({ message: "OTP has been sent successfully!", otp: otp });
    });
  };

  static sendImage(req, res) {
    res.json({
      message: "Image Uploaded Successfully.",
      file: {
        fileName: req.file.originalname,
        size: req.file.size,
        path: "uploads/" + req.file.filename,
      },
    });
  }
  static sendVideo(req, res) {
    res.json({
      message: "Video Uploaded Successfully.",
      file: {
        fileName: req.file.originalname,
        size: req.file.size,
        path: "uploads/" + req.file.filename,
      },
    });
  }

  static sendNumberOtp(req, res) {
    var message = {
      from: "whatsapp:+14155238886",
      body: "Hello there!",
      to: "whatsapp:" + req.body.phone,
    };
    console.log(req.body);
    client.messages
      .create(message)
      .then((msg) => {
        if (msg.status == "sent") {
          res.json({ message: "Message has been sent", data: msg });
        }else if(msg.status=="queued"){
          res.json({ message: "Message has been delivered in queued", data: msg });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: "send error" });
      });
    // client.verify.v2
    //   .services(verifySid)
    //   .verifications.create({ to: req.body.phone, channel: "sms" })
    //   .then((verification) => {
    //     res.json({
    //       valid: verification.valid,
    //       status: verification.status,
    //       phone: verification.to,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     res.json({message:"otp send error",error:err});
    //   });
  }

  static verifyOTP(req, res) {
    client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: req.body.phone, code: req.body.otp })
      .then((verification_check) => {
        if (verification_check.valid) {
          res.json({
            valid: verification_check.valid,
            status: verification_check.status,
            message: "Verification Succeeded.",
          });
        } else {
          res.json({
            valid: verification_check.valid,
            status: verification_check.status,
            message: "Check your entered otp.",
          });
        }
      })
      .catch((err) => {
        res
          .status(err.status)
          .json({ success: false, message: "User is already verified!" });
      });
  }

  static signUp = async (req, res) => {
    const hashPassword = await bcrypt
      .hash(req.body.password, 10)
      .catch((err) => {
        res.status(400).json({ error: "Password hashing error!" });
      });

    const user = new User({
      profile: "user/" + req.file.filename,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashPassword,
      phoneCode: req.body.phoneCode,
      phoneNumber: req.body.phoneNumber,
      phoneCountry: req.body.phoneCountry,
      location: {
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      },
    });

    await user
      .save()
      .then((value) => {
        res.status(201).json({
          message: "Data inserted Successfully",
          data: value,
        });
      })
      .catch((err) => {
        fs.unlinkSync(req.file.path);
        res.status(403).json({ error: err.message });
      });
  };
  static login = (req, res) => {
    User.findOne({
      email: req.body.email,
      isVerified: true,
    })
      .then((doc) => {
        if (!doc) {
          res.status(404).json({ message: "User not found!" });
        } else {
          bcrypt
            .compare(req.body.password, doc.password)
            .then((result) => {
              if (result) {
                const token = jwt.sign(
                  {
                    email: doc.email,
                    password: doc.password,
                    id: doc.id,
                  },
                  process.env.TOKEN_SECRET
                );

                res.json({
                  message: "Login successfully!",
                  data: doc,
                  token,
                });
              } else {
                res.status(401).json({ message: "Check your password!" });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ error: "Serverside error occured!" });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  };
}

module.exports = RegistrationController;
