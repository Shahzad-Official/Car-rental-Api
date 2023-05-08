require("dotenv").config();
const nodeMailer = require("nodemailer");
const otpGen = require("otp-generator");
const accountSid = "AC05a2aa74b5ae229fcac4a3d0feb9f6b4";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VA9028c16ea7d62e48a38137272a04efc3";
const client = require("twilio")(accountSid, authToken);

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

  static sendFile  (req, res) {
   
   
  
    
    res.json({message:"File Uploaded Successfully.",file:req.file,});
  };

  static sendNumberOtp  (req, res) {
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: req.body.phone, channel: "sms" })
      .then((verification) => {
        res.json({
          valid: verification.valid,
          status: verification.status,
          phone: verification.to,
        });
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  static verifyOTP  (req, res)  {
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
        throw Error(err.Error);
      });
  };
}

module.exports = RegistrationController;
