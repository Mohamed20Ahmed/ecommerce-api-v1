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

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError("You are not login, Please login to access this route", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exists",
        401
      )
    );
  }

  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt / 1000,
      10
    );

    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password, please login again..",
          401
        )
      );
    }
  }

  req.user = currentUser;

  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }

    next();
  });
