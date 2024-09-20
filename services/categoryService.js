const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Category = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

exports.getCategories = asyncHandler(async (req, res, next) => {
  const documentsCounts = await Category.countDocuments();

  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;

  const categories = await mongooseQuery;

  res
    .status(200)
    .json({ results: categories.length, paginationResult, data: categories });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }

  res.status(200).json({ data: category });
});

exports.createCategory = factory.createOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
