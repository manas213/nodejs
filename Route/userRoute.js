const express = require('express')
const { addUser } = require('../Controller/userController')
const router = express.Router()

router.post('/adduser', addUser)

module.exports = router