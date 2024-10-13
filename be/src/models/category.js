const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const categorySchema = new Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("Category", categorySchema);
