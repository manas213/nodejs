const Order = require("../Model/order");
const OrderItem = require("../Model/orderItem");

// product1, product2, product3
exports.placeOrder = async (req, res) => {
  const orderItemIds = await Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        product: orderItem.product,
        quantity: orderItem.quantity,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  // calculating total price
  const individualTotalPrice = await Promise.all(
    orderItemIds.map(async (orderItem) => {
      const order = await OrderItem.findById(orderItem).populate(
        "product",
        "product_price"
      );
      const total = order.quantity * order.product.product_price;
      return total;
    })
  );
  /*
    arr = [1,2,3,4,5]
    arr.reduce((acc,curr)=>{return acc+curr})
    acc = 1, curr = 2
    acc = 1+2, curr = 3
    acc = 3+3, curr = 4
    acc = 6+4, curr = 5
    acc = 10+5 
    return 15
  */
  const TotalPrice = individualTotalPrice.reduce((a, b) => a + b); //reduce function

  let order = new Order({
    OrderItems: orderItemIds,
    user: req.body.user,
    shippingAddress: req.body.shippingAddress,
    shippingAddress2: req.body.shippingAddresss2,
    phone: req.body.phone,
    totalPrice: TotalPrice,
  });
  order = await order.save();
  if (!order) {
    return res.sendStatus(400).json({ error: "Order could not be found" });
  }
  res.send(order);
};

// TO VIEW ALL ORDERS

exports.orderList = async (req, res) => {
  const order = await Order.find().populate("user", "name");
  if (!order) {
    return res.sendStatus(400).json({ error: "Something went wrong" });
  }
  res.send(order);
};

// TO VIEW ORDER DETAILS OF A PARTICULAR

exports.orderDetail = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "OrderItems",
      populate: { path: "product", populate: "category" },
    });
  if (!order) {
    return res.sendStatus(400).json({ error: "Something went wrong" });
  }
  res.send(order);
};

// TO VIEW ORDER DETAILS OF A PARTICULAR USER

exports.userOrder = async (req, res) => {
  const order = await Order.find({ user: req.params.userid }).populate({
    path: "OrderItems",
    populate: { path: "product", populate: "category" },
  });
  if (!order) {
    return res.sendStatus(400).json({ error: "Something went wrong" });
  }
  res.send(order);
};

// TO UPDATE ORDER

exports.updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      sendStatus: req.body.sendStatus,
    },
    { new: true }
  );
  if (!order) {
    return res.sendStatus(400).json({ error: "Something went wrong" });
  }
  res.send(order);
};

// TO DELETE ORDER

exports.deleteOrder = (req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.OrderItems.map(async (orderItem) => {
          await orderItem.findByIdAndRemove(orderItem);
        });
        return res.sendStatus(200).json({ message: "Order deleted successfully" });
      } else {
        return res.sendStatus(400).json({ error: "Failed to delete order" });
      }
    })
    .catch((error) => {
      return res.sendStatus(400).json({ error: error });
    });
};
