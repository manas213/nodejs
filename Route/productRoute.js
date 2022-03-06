const express = require("express");
const { addProduct, showProducts, productDetails, updateProduct,deleteProduct } = require("../Controller/productController");
const upload = require('../Middleware/upload')
const { productValidation } = require('../Validation/productValidation')
const router = express.Router();

router.post('/addproduct', upload.single('product_img'),productValidation , addProduct)
router.get('/showproducts',showProducts)
router.get('/productdetails/:id', productDetails)
router.put('/updateproduct/:id', updateProduct)
router.delete('/deleteproduct/:id', deleteProduct)

module.exports = router
