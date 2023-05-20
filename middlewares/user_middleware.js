const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

class UserMiddlewares {
  static validateUser = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const result = jwt.decode(token);
    const { email } = result;
    User.findOne({ email: email })
      .then((doc) => {
        if (!doc) {
          res.status(404).json({ message: "This email does not exist!" });
        } else {
          next();
        }
      })
      .catch((err) => {
        res.status(500).json({ error: "Error fetching data!" });
      });
  };
  static updateMiddleware = function (req, res, next) {
    User.findOne({
      email: req.body.email,
    }).then((doc) => {
      if (doc) {
        const schema = Joi.object({
          email: Joi.string().email().required(),
          firstname: Joi.string().min(3).max(30).required(),
        }).unknown();
        const { error } = schema.validate(req.body);

        if (error) {
          fs.unlinkSync(req.file.path);
          return res.status(403).json({ error: error.details[0].message });
        } else {
          next();
        }
      } else {
        fs.unlinkSync(req.file.path);
        res.status(409).json({ message: "The email is not exist exist!" });
      }
    });
  };
  static updatePasswordMiddleware = (req, res, next) => {
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
  static updateStatusMiddleware = (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      isVerified:Joi.bool().required(),
    });
    const error = schema.validate(req.body);
    if (error.error) {
      res.status(403).json({ error: error.error.details[0].message });
    } else {
      next();
    }
  };
}
module.exports = UserMiddlewares;
