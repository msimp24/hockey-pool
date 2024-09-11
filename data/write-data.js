const cheerio = require('cheerio')
const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Matchup = require('../models/Matchup')

const getMatchupData = async () => {
  try {
    const response = await fetch(
      'https://www.hockey-reference.com/leagues/NHL_2025_games.html'
    )
    const text = await response.text()

    const $ = cheerio.load(text)

    const rowData = []

    $('tbody > tr').each((index, element) => {
      const date = $(element).find('th').text()
      const time = $(element).find('td:nth-child(2)').text()
      const visitingTeam = $(element).find('td:nth-child(3)').text()
      const visitingScore = $(element).find('td:nth-child(4)').text()
      const homeTeam = $(element).find('td:nth-child(5)').text()
      const homeScore = $(element).find('td:nth-child(6)').text()

      rowData.push({
        gameNumber: index,
        date: date,
        time: time,
        visitingTeam: {
          name: visitingTeam,
          score: 0,
        },
        homeTeam: {
          name: homeTeam,
          score: 0,
        },
      })
    })

    dotenv.config({ path: './config.env' })

    const DB = process.env.DATABASE.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD
    )

    mongoose.connect(DB).then((con) => {
      console.log('DB connection successful')
    })
    const result = await Matchup.insertMany(rowData)
  } catch (err) {
    console.log(err)
  }
}
getMatchupData()
