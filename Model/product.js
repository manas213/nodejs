const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    product_price: {
      type: Number,
      required: true,
      trim: true,
    },
    product_desc: {
      type: String,
      required: true,
      trim: true,
    },
    product_img: {
      type: String,
      required: true,
      trim: true,
    },
    count_In_Stock: {
      type: Number,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 1,
      max: 5,
      required: true,
    },
    category: {
      type: ObjectId,
      required: true,
      ref: "Category",
    },
    review: {
      type: String,
    },
  },
  { timestamps: true }
);
//createdAt
//updatedAt

module.exports = mongoose.model("Products", productSchema);
