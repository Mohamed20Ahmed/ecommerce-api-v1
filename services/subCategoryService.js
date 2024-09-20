const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const SubCategory = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

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

exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findById(id).populate({
    path: "category",
    select: "name -_id",
  });

  if (!subCategory) {
    return next(new ApiError(`No subCategory for this id ${id}`, 404));
  }

  res.status(200).json({ data: subCategory });
});

exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;

  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(201).json({ data: subCategory });
});

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    {
      name,
      slug: slugify(name),
      category,
    },
    { new: true }
  );

  if (!subCategory) {
    return next(new ApiError(`No subCategory for this id ${id}`, 404));
  }

  res.status(200).json({ data: subCategory });
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findByIdAndDelete(id);

  if (!subCategory) {
    return next(new ApiError(`No subCategory for this id ${id}`, 404));
  }

  res.status(204).send();
});

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
