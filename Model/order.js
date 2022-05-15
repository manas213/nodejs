//to store orders of a customer/user

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const OrderSchema = new mongoose.Schema(
  {
    OrderItems: [
      {
        type: ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    shippingAddress2: {
      type: String,
    },
    phone: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
