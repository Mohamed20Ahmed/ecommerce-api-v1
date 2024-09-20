const asyncHandler = require("express-async-handler");

const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

exports.getProducts = asyncHandler(async (req, res, next) => {
  const documentsCounts = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search("Products")
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;

  const products = await mongooseQuery;

  res
    .status(200)
    .json({ results: products.length, paginationResult, data: products });
});

exports.getProduct = factory.getOne(Product);

exports.createProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
