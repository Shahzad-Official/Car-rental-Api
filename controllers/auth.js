const multer = require("multer");
const nodeMailer = require("nodemailer");
const otpGen = require("otp-generator");

require("dotenv").config();
let transporter = nodeMailer.createTransport({
  host: process.env.SMTP,
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});
sendOTP = async (req, res) => {
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

sendFile = function (req, res) {
    
  res.json(req.files);
};
module.exports = { sendOTP, sendFile };
