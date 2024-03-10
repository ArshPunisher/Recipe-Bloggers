require('dotenv').config();

const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const path = require('path')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
const staticRoute = require('./routes/staticRoute');
const userRoute = require('./routes/users');
const {checkAuth} = require('./middlewares/authentication')

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_DB)
.then((console.log("Created Mongodb")))

app.set("view engine", "ejs")
app.set("layout", "./layouts/main")

app.use(cookieParser())
app.use(expressLayouts)
app.use(express.static(path.resolve('./public')))
app.use(express.urlencoded({extended:true}))
app.use(express.json());


app.use(checkAuth('token'))
app.use('/', staticRoute)
app.use('/users', userRoute)

app.listen(PORT, ()=>{console.log(`Server started at PORT: ${PORT}`)})