const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: [true, "name required"] },

    slug: { type: String, lowercase: true },

    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },

    phone: String,

    profileImg: String,

    password: {
      type: String,
      required: [true, "email required"],
      minLength: [6, "Too short password"],
    },

    passwordChangedAt: Date,

    passwordResetCode: String,

    passwordResetExpires: Date,

    passwordResetVerified: Boolean,

    role: { type: String, enum: ["user", "manager", "admin"] },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
