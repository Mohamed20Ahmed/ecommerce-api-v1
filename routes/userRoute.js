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
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../services/userService");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");
const { protect, allowedTo } = require("../services/authService");

router.use(protect);

router.get("/getMe", getLoggedUserData, getUser);

router.patch("/changeMyPassword", updateLoggedUserPassword);

router.patch("/updateMe", updateLoggedUserValidator, updateLoggedUserData);

router.delete("/deleteMe", deleteLoggedUserData);

router
  .route("/")
  .get(allowedTo("manager", "admin"), getUsers)
  .post(
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(allowedTo("admin"), getUserValidator, getUser)
  .patch(
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(allowedTo("admin"), deleteUserValidator, deleteUser);

router.put("/changePassword/:id", allowedTo("admin"), changeUserPassword);

module.exports = router;
