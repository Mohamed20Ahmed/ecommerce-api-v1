const express = require("express");

const router = express.Router();

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");
const { protect, allowedTo } = require("../services/authService");

router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    allowedTo("manager", "admin"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .patch(
    protect,
    allowedTo("manager", "admin"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, allowedTo("admin"), deleteBrandValidator, deleteBrand);

module.exports = router;
