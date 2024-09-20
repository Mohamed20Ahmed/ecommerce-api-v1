const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

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

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate({
    path: "category",
    select: "name",
  });

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }

  res.status(200).json({ data: product });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);

  const product = await Product.create(req.body);

  res.status(201).json({ data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }

  res.status(200).json({ data: product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }

  res.status(204).send();
});
