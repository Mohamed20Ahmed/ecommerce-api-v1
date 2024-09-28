const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcrypt");

const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    req.body.profileImg = filename;
  }

  next();
});

exports.getUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.createUser = factory.createOne(User);

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name, slug, phone, email, profileImg, role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, slug, phone, email, profileImg, role },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: user });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: user });
});

exports.deleteUser = factory.deleteOne(User);
