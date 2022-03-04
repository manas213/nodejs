const express = require("express");
const router = express.Router();

const { addCategory, showCategories, findCategory } = require("../Controller/categoryController");
// const { route } = require('express/lib/application')
// const { showInfo, showMessage } = require('../Controller/categoryController')

// router.get('/', showInfo)
// router.get('/message', showMessage)

router.post("/addcat", addCategory);
router.get("/categories", showCategories);
router.get("/findcat/:id", findCategory)


module.exports = router;
