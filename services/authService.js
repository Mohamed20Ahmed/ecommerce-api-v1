const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

exports.signup = asyncHandler(async (req, res, next) => {
  const { name, slug, email, password } = req.body;

  const user = await User.create({ name, slug, email, password });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  res.status(201).json({ data: user, token });
});
