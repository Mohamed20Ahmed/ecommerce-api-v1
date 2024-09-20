const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "brand name required"],
      unique: [true, "brand name must be unique"],
      minLength: [2, "too short brand name"],
      maxLength: [32, "too long brand name"],
    },

    slug: { type: String, lowerCase: true },

    image: String,
  },
  { timestamps: true }
);

const brandModel = mongoose.model("Brand", brandSchema);

module.exports = brandModel;
