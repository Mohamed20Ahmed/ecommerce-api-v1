const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.getSubCategories = factory.getAll(SubCategory);

exports.getSubCategory = factory.getOne(SubCategory);

exports.createSubCategory = factory.createOne(SubCategory);

exports.updateSubCategory = factory.updateOne(SubCategory);

exports.deleteSubCategory = factory.deleteOne(SubCategory);

exports.createFilterObj = (req, res, next) => {
  let filterObj = {};

  if (req.params.categoryId) {
    filterObj = { category: req.params.categoryId };
  }

  req.filterObj = filterObj;

  next();
};

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }

  next();
};
