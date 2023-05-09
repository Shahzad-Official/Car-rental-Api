const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const User = require("../models/user_model");
const storage = multer.diskStorage({
  destination: "./public/upload",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).split(".")[1];
  if (extension === "png" || extension === "jpg" || extension === "jpeg") {
    return cb(null, true);
  } else {
    return cb(Error("only images are allowed"));
  }
};
const videoFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).split(".")[1];
  if (extension === "mp4" || extension === "mkv" || extension === "mov") {
    return cb(null, true);
  } else {
    return cb(Error("only videos are allowed"));
  }
};
class AuthMiddleware {
  static imageMiddleware = multer({
    storage: storage,
    fileFilter: imageFilter,
  }).single("image");

  static videoMiddleware = multer({
    storage: storage,
    fileFilter: videoFilter,
  }).single("video");

  static signUpMiddleware = function (req, res, next) {
    User.findOne({
      email: req.body.email,
    }).then((doc) => {
      if (!doc) {
        const schema = Joi.object({
          email: Joi.string().email().required(),
          firstname: Joi.string().min(3).max(30).required(),
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
          return res.status(403).json({ error: error.details[0].message });
        } else {
          next();
        }
      } else {
        res.status(409).json({ message: "The email is already exist!" });
      }
    });
  };
}
module.exports = AuthMiddleware;
