const asyncHandler = require("express-async-handler");

const SubCategory = require("../models/subCategoryModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const documentsCounts = await SubCategory.countDocuments();

  const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;

  const subCategories = await mongooseQuery;

  res.status(200).json({
    results: subCategories.length,
    paginationResult,
    data: subCategories,
  });
});

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
