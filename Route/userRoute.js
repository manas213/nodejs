const express = require('express')
const { addUser } = require('../Controller/userController')
const { userValidation } = require('../Validation/userValidation')
const router = express.Router()

router.post('/adduser', userValidation, addUser)

module.exports = router