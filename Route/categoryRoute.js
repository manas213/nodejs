const express = require("express");
const router = express.Router();

const {
  addCategory,
  showCategories,
  findCategory,
  updateCategory,
  deleteCategory,
} = require("../Controller/categoryController");
const { requireSignin } = require("../Controller/userController");
// const { categoryValidation } = require("../Validation/categoryValidation");
const { categoryCheck, validation } = require("../Validation/validation");
// const { route } = require('express/lib/application')
// const { showInfo, showMessage } = require('../Controller/categoryController')

// router.get('/', showInfo)
// router.get('/message', showMessage)

router.post("/addcat", categoryCheck, validation, addCategory);
router.get("/categories", showCategories);
router.get("/findcat/:id", findCategory);
router.put("/updatecat/:id", requireSignin, categoryCheck, validation, updateCategory);
router.delete("/deletecat/:id", deleteCategory);

module.exports = router;
