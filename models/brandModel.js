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

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

brandSchema.post("init", (doc) => {
  setImageURL(doc);
});

brandSchema.post("save", (doc) => {
  setImageURL(doc);
});

const brandModel = mongoose.model("Brand", brandSchema);

module.exports = brandModel;
