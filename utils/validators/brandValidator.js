const { check } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleWare = require("../../middlewares/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("nvalid brand id format"),

  validatorMiddleWare,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name required")
    .isLength({ min: 2 })
    .withMessage("Too short brand name")
    .isLength({ max: 32 })
    .withMessage("Too long brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleWare,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),

  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Too short brand name")
    .isLength({ max: 32 })
    .withMessage("Too long brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleWare,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),

  validatorMiddleWare,
];
