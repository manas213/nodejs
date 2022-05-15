const express = require("express");
const router = express.Router();
const {
  placeOrder,
  orderList,
  orderDetail,
  userOrder,
  updateOrder,
  deleteOrder,
} = require("../Controller/orderController");

router.post("/postorder", placeOrder);
router.get("/orderlist", orderList);
router.get("/orderdetail/:id", orderDetail);
router.get("/userorder/:userid", userOrder);
router.put("/updateorder/:id", updateOrder);
router.delete("/deleteorder/:id", deleteOrder);

module.exports = router;
