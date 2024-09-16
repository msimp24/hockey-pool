const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

//import routes
const authRouter = require('./routes/authRoute.js')
const matchupRouter = require('./routes/matchupRoute.js')
const poolRouter = require('./routes/poolRoute.js')
const userPoolRouter = require('./routes/userPoolRoute.js')

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(express.raw())

app.use('/user', authRouter)
app.use('/matchup', matchupRouter)
app.use('/pool', poolRouter)
app.use('/pool', userPoolRouter)

module.exports = app
