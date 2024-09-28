const express = require("express");

const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
} = require("../services/userService");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../utils/validators/userValidator");
const { protect, allowedTo } = require("../services/authService");

router
  .route("/")
  .get(protect, allowedTo("manager", "admin"), getUsers)
  .post(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(protect, allowedTo("admin"), getUserValidator, getUser)
  .patch(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(protect, allowedTo("admin"), deleteUserValidator, deleteUser);

router.put("/changePassword/:id", changeUserPassword);

module.exports = router;
