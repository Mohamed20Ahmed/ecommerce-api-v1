const asyncHandler = require("express-async-handler");

const Brand = require("../models/brandModel");
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

exports.getBrand = factory.getOne(Brand);

exports.createBrand = factory.createOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deleteOne(Brand);
