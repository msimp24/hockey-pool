const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const cron = require('node-cron')
const axios = require('axios')
const path = require('path')
const {
  getMatchupData,
  updateMatchupScores,
} = require('./jobs/updateMatchupsJob.js')

let week = 2

cron.schedule('0 6 * * 0', async () => {
  try {
    const scrapedData = await getMatchupData()
    await updateMatchupScores(scrapedData)
  } catch (err) {
    console.error('Error running cron job:', err)
  }
})

cron.schedule('0 6 * * 0', async () => {
  try {
    console.log('Running put request at 5 am Monday morning')

    const response = await axios.put(
      `https://hockey-pool-frontend.onrender.com/picks/all-picks/${week}`
    )
    console.log(response)
    week++
  } catch (err) {
    console.log('Error with the PUT')
  }
})
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} request for ${req.url}`
  )
  next()
})

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')))

// Serve static files from the 'dist' directory (if applicable)
app.use(express.static(path.join(__dirname, 'dist')))

// Redirect all other routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.use(
  cors(
    process.env.FRONTEND_URL || 'https://hockey-pool-frontend.onrender.com' // Use an environment variable for the frontend URL
  )
)
//app.use(cors())

app.use(express.json())
app.use(morgan('dev'))
app.use(express.raw())

//import routes
const authRouter = require('./routes/authRoute.js')
const matchupRouter = require('./routes/matchupRoute.js')
const poolRouter = require('./routes/poolRoute.js')
const userPoolRouter = require('./routes/userPoolRoute.js')
const picksRouter = require('./routes/picksRoute.js')

app.use('/user', authRouter)
app.use('/matchup', matchupRouter)
app.use('/pool', poolRouter)
app.use('/user-pool', userPoolRouter)
app.use('/picks', picksRouter)

module.exports = app
