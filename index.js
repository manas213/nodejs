const express = require("express"); //to create express api, require => importing
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

const db = require('./Database/connection')
const bodyParser = require('body-parser')

// app.get('/', (req,res)=>{
//     res.send('Welcome to Express Js')
// })

const CategoryRoute = require('./Route/categoryRoute')
const ProductRoute = require('./Route/productRoute')
const morgan = require('morgan')
const expressValidator = require('express-validator')

// middleware
app.use (bodyParser.json())
app.use('/public/uploads',express.static('public/uploads'))

app.use(morgan('dev'))
app.use ('/api', CategoryRoute)
app.use ('/api', ProductRoute)
app.use(expressValidator())

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
