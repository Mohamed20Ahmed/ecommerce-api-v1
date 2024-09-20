const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Brand = require("../models/brandModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

exports.getBrands = asyncHandler(async (req, res, next) => {
  const documentsCounts = await Brand.countDocuments();

  const apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;

  const brands = await mongooseQuery;

  res
    .status(200)
    .json({ results: brands.length, paginationResult, data: brands });
});

exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }

  res.status(200).json({ data: brand });
});

exports.createBrand = factory.createOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deleteOne(Brand);
