const express = require("express"); //to create express api, require => importing
require("dotenv").config();
const db = require('./Database/connection')
const expressValidator = require('express-validator')
const bodyParser = require('body-parser')
const CategoryRoute = require('./Route/categoryRoute')
const ProductRoute = require('./Route/productRoute')
const UserRoute = require('./Route/userRoute')
const morgan = require('morgan')

const app = express();
const port = process.env.PORT || 8000;

// app.get('/', (req,res)=>{
//     res.send('Welcome to Express Js')
// })

// middleware
app.use (bodyParser.json())
app.use('/public/uploads',express.static('public/uploads'))
app.use(morgan('dev'))
app.use(expressValidator())

app.use ('/api', CategoryRoute)
app.use ('/api', ProductRoute)
app.use ('/api', UserRoute)

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
