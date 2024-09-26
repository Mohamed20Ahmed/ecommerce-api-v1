const { check } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleWare = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.signupValidator = [
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((email) => {
        if (email) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }

      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  validatorMiddleWare,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validatorMiddleWare,
];
