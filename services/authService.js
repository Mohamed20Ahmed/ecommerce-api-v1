const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

exports.signup = asyncHandler(async (req, res, next) => {
  const { name, slug, email, password } = req.body;

  const user = await User.create({ name, slug, email, password });

  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});
