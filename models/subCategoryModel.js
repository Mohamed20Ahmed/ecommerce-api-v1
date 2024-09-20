const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "subCategory name required"],
      unique: [true, "subCategory name must be unique"],
      minLength: [2, "too short subCategory name"],
      maxLength: [32, "too long subCategory name"],
    },

    slug: { type: String, lowercase: true },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must be belong to category"],
    },
  },
  { timestamps: true }
);

const subCategoryModel = mongoose.model("SubCategory", subCategorySchema);

module.exports = subCategoryModel;
