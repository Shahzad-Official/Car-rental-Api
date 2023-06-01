const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const imageStorage = multer.diskStorage({
  destination: "./public/images/profiles",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});
const videoStorage = multer.diskStorage({
  destination: "./public/videos",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).split(".")[1];
  if (extension === "png" || extension === "jpg" || extension === "jpeg") {
    return cb(null, true);
  } else {
    const error = Error("only images are allowed");
    error.statusCode = 403;
    return cb(error);
  }
};
const videoFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).split(".")[1];
  if (extension === "mp4" || extension === "mkv" || extension === "mov") {
    return cb(null, true);
  } else {
    const error = Error("only videos are allowed");
    error.statusCode = 403;
    return cb(error);
  }
};
class AuthMiddleware {
  static imageMiddleware = multer({
    storage: imageStorage,
    fileFilter: imageFilter,
  }).single("profile");

  static videoMiddleware = multer({
    storage: videoStorage,
    fileFilter: videoFilter,
  }).single("video");

  static validateUserForSendOtp = function (req, res, next) {
    const { email, phoneCode, number, phone } = req.body;
    const schema = Joi.object({
      email: Joi.string().email().required(),
      phoneCode: Joi.string().required(),
      number: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(403).json({ error: error.details[0].message });
    } else {
      User.findOne({
        email: email,
        phoneCode: phoneCode,
        phoneNumber: number,
      }).then((doc) => {
        if (doc) {
          next();
        } else {
          res
            .status(400)
            .json({ message: "Check your registered email and phone number!" });
        }
      });
    }
  };

  static signUpMiddleware = function (req, res, next) {
    
    if (req.file == null) {
      res.status(400).json({ message: "Profile image is required" });
    } else {
      User.findOne({
        email: req.body.email,
      }).then((doc) => {
        if (!doc) {
          const schema = Joi.object({
            email: Joi.string().email().required(),
            firstname: Joi.string().min(3).max(30).required(),
            phoneCode: Joi.string().required(),
            phoneCountry: Joi.string().required(),
            phoneNumber: Joi.string().required(),

            password: Joi.string()
              .pattern(
                new RegExp(
                  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
                )
              )
              .required()
              .messages({
                "string.pattern.base": `"" Password must have at least 8 characters, including at least one lowercase letter, one uppercase letter, one digit, and one special character.`,
              }),
          }).unknown();
          const { error } = schema.validate(req.body);

          if (error) {
            console.log(error);
            fs.unlinkSync(req.file.path);
            return res.status(403).json({ error: error.details[0].message });
          } else {
            next();
          }
        } else {
          fs.unlinkSync(req.file.path);
          res.status(409).json({ message: "The email is already exist!" });
        }
      });
    }
  };
  static loginMiddleware = (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
          )
        )
        .required()
        .messages({
          "string.pattern.base": `"" Password must have at least 8 characters, including at least one lowercase letter, one uppercase letter, one digit, and one special character.`,
        }),
    }).unknown();
    const error = schema.validate(req.body);
    if (error.error) {
      res.status(403).json({ error: error.error.details[0].message });
    } else {
      next();
    }
  };
  static tokenAuthentication = (req, res, next) => {
    
    if (req.headers.authorization == null) {
      res.status(401).json({ message: "Token required!" });
    } else {
      const token = req.headers.authorization.split("Bearer ")[1];

      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        } else {
          next();
        }
      });
    }
  };
}
module.exports = { AuthMiddleware, imageFilter };
