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

let week = 1

cron.schedule('25 20 * * *', async () => {
  try {
    const scrapedData = await getMatchupData()
    await updateMatchupScores(scrapedData)
  } catch (err) {
    console.error('Error running cron job:', err)
  }
})

cron.schedule('0 5 * * 1', async () => {
  try {
    console.log('Running put request at 5 am Monday morning')

    const response = await axios.put(
      `https://localhost:8080/picks/all-picks/${week}`
    )
    console.log(response)
    week++
  } catch (err) {
    console.log('Error with the PUT')
  }
})

//import routes
const authRouter = require('./routes/authRoute.js')
const matchupRouter = require('./routes/matchupRoute.js')
const poolRouter = require('./routes/poolRoute.js')
const userPoolRouter = require('./routes/userPoolRoute.js')
const picksRouter = require('./routes/picksRoute.js')

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(express.raw())

app.use('/user', authRouter)
app.use('/matchup', matchupRouter)
app.use('/pool', poolRouter)
app.use('/user-pool', userPoolRouter)
app.use('/picks', picksRouter)

app.get('/', (req, res) => {
  res.send('Welcome to my API!')
})

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')))

// Catch-all route for SPA
app.get('*', (req, res) => {
  console.log('Serving index.html for', req.url) // Debug log
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

module.exports = app
