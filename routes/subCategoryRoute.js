const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");
const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const { protect, allowedTo } = require("../services/authService");

router
  .route("/")
  .get(createFilterObj, getSubCategories)
  .post(
    protect,
    allowedTo("manager", "admin"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .patch(
    protect,
    allowedTo("manager", "admin"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
