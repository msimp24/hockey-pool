const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

//import routes
const authRouter = require('./routes/authRoute.js')

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(express.raw())

app.use('/user', authRouter)

module.exports = app
