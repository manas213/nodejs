const Product = require("../Model/product");

exports.addProduct = async (req, res) => {
  let product = new Product({
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_img: req.file.path,
    product_desc: req.body.product_desc,
    count_In_Stock: req.body.count_In_Stock,
    category: req.body.category,
  });
  product = await product.save();
  if (!product) {
    return res.status(400).json({ error: "Something went wrong." });
  } else {
    res.send(product);
  }
};

// to show all products
exports.showProducts = async (req, res) => {
  let products = await Product.find().populate("category");
  if (!products) {
    return res.status(400).json({ error: "Something went wrong." });
  } else {
    res.send(products);
  }
};

// to view a product
exports.productDetails = async (req, res) => {
  let product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    return res.status(400).json({ error: "Something went wrong." });
  } else {
    res.send(product);
  }
};

exports.updateProduct = async (req, res) => {
  let product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      product_name: req.body.product_name,
      product_price: req.body.product_price,
      product_img: req.file.path,
      product_desc: req.body.product_desc,
      count_In_Stock: req.body.count_In_Stock,
      category: req.body.category,
    },
    { new: true }
  );
  if (!product) {
    return res.status(400).json({ error: "Something went wrong." });
  } else {
    res.send(product);
  }
};

// to delete a product
exports.deleteProduct = (req, res) => {
  let product = Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (!product) {
        return res.status(400).json({ error: "Product not found." });
      } else {
        return res.status(200).json({ msg: "Product deleted successfully" });
      }
    })
    .catch((error) => res.status(400).json({ error: error }));
};
