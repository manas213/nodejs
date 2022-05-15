const { check, validationResult } = require("express-validator");

exports.validation = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
  } else {
    return res.status(400).json({ error: errors.array()[0].msg });
    // return res.status(400).json({error:errors.array().map(err=>err.msg)})
  }
};

exports.categoryCheck = [
  check("category_name", "category name is requied")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("category must be at least 3 characters"),
];

exports.productCheck = [
  check("product_name", "Product name is required").notEmpty(),
  check("product_price", "Product price is required")
    .notEmpty()
    .isNumeric()
    .withMessage("price must be number only"),
  check("count_In_Stock", "Count in stock is required")
    .notEmpty()
    .isNumeric()
    .withMessage("Count must be a number"),
  check("product_desc", "Product description is required")
    .notEmpty()
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters in length"),
  check("category", "Category is required").notEmpty(),
];
exports.userCheck = [
  check("first_name", "First Name is required").notEmpty(),
  check("last_name", "Last Name is required").notEmpty(),
  check("date_of_birth", "date of birth is required").notEmpty(),
  check("gender", "Gender is required").notEmpty(),
  check("email", "Email is required")
    .notEmpty()
    .isEmail()
    .withMessage("Email format invalid"),
  check("password", "Password is required")
    .notEmpty()
    .isLength({ min: 8, max: 30 })
    .withMessage("Password must be between 8 and 30 characters"),
];
