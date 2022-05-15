exports.categoryValidation = (req, res, next) => {
  req.check("category_name", "Category name is required").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    const showError = errors.map((err) => err.msg)[0];
    return res.sendStatus(400).json({ error: showError });
  }
  next();
};
