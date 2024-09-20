const { check } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

function checkSubCategoriesInDB() {
  return (subCategoriesIds) =>
    SubCategory.find({
      _id: { $exists: true, $in: subCategoriesIds },
    }).then((subCategories) => {
      if (subCategories.length !== subCategoriesIds.length) {
        return Promise.reject(new Error("Invalid subCategories ids"));
      }
    });
}

function checkCategoryInDB() {
  return (categoryId) =>
    Category.findById(categoryId).then((category) => {
      if (!category) {
        return Promise.reject(
          new Error(`No category for this id ${categoryId}`)
        );
      }
    });
}

function checkSubCategoriesBelongToCategory() {
  return (subCategoriesIds, { req }) =>
    SubCategory.find({
      category: req.body.category,
      _id: { $exists: true, $in: subCategoriesIds },
    }).then((subCategories) => {
      console.log(subCategories);
      if (subCategories.length !== subCategoriesIds.length) {
        return Promise.reject(
          new Error("SubCategories not be belong to category")
        );
      }
    });
}
exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),

  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("product title is required")
    .isLength({ min: 3 })
    .withMessage("Too short product title")
    .isLength({ max: 100 })
    .withMessage("Too long product title")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Too short product description"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),

  check("price")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric({ max: 20 })
    .withMessage("Product price must be a number"),

  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("product colors should be array of string"),

  check("imageCover").notEmpty().withMessage("Product imageCover is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("product images should be array of string"),

  check("category")
    .notEmpty()
    .withMessage("Product must be belong to category")
    .isMongoId()
    .withMessage("Invalid category id format")
    .custom(checkCategoryInDB()),

  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid subCategories ids format")
    .custom(checkSubCategoriesInDB())
    .custom(checkSubCategoriesBelongToCategory()),

  check("brand").optional().isMongoId().withMessage("Invalid brand id format"),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),

  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short product title")
    .isLength({ max: 100 })
    .withMessage("Too long product title")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),

  validatorMiddleware,
];
