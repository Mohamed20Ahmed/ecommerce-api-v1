const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Brand = require("../models/brandModel");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;

  next();
});

exports.getBrands = factory.getAll(Brand);

exports.getBrand = factory.getOne(Brand);

exports.createBrand = factory.createOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deleteOne(Brand);
