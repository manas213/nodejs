const express = require("express");
const { addProduct, showProducts, productDetails, updateProduct,deleteProduct, findRelated,filterProduct } = require("../Controller/productController");
const { requireSignin } = require("../Controller/userController");
const upload = require('../Middleware/upload')
// const { productValidation } = require('../Validation/productValidation');
const { productCheck, validation } = require("../Validation/validation");
const router = express.Router();

router.post('/addproduct', upload.single('product_img'),productCheck, validation, addProduct)
router.get('/showproducts',showProducts)
router.get('/productdetails/:id', productDetails)
router.put('/updateproduct/:id', productCheck, validation, updateProduct)
router.delete('/deleteproduct/:id', requireSignin, deleteProduct)
router.get('/getrelatedproducts/:id',findRelated)
router.post('/getfilteredproducts',filterProduct)

module.exports = router
