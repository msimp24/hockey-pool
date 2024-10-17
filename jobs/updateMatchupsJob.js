const cheerio = require('cheerio')
const Matchup = require('./../models/Matchup')

//scraping function to get data
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
      const visitingTeam = $(element).find('td:nth-child(3)').text()
      const visitingScore = $(element).find('td:nth-child(4)').text()
      const homeTeam = $(element).find('td:nth-child(5)').text()
      const homeScore = $(element).find('td:nth-child(6)').text()

      rowData.push({
        date: date,
        visitingTeam: {
          name: visitingTeam,
          score: visitingScore,
        },
        homeTeam: {
          name: homeTeam,
          score: homeScore,
        },
      })
    })

    return rowData
  } catch (err) {
    console.log(err)
  }
}

const updateMatchupScores = async (scrapedData) => {
  try {
    let matchCount = 1
    for (const scrapedItem of scrapedData) {
      const { date: scrapedDate, visitingTeam, homeTeam } = scrapedItem

      const date = new Date(scrapedDate)

      const existingMatchup = await Matchup.findOne({
        date,
        'visitingTeam.name': visitingTeam.name,
        'homeTeam.name': homeTeam.name,
      })

      if (!existingMatchup) {
        console.error('Matchup not found for the given data:', scrapedItem)
        continue // Skip to the next item in the array
      }

      if (
        existingMatchup.visitingTeam.score !== visitingTeam.score ||
        existingMatchup.homeTeam.score !== homeTeam.score
      ) {
        existingMatchup.visitingTeam.score = visitingTeam.score
        existingMatchup.homeTeam.score = homeTeam.score

        await existingMatchup.save()

        console.log('Matchup updated successfully:' + matchCount)
        matchCount++
      } else {
        console.log('Matchup already up-to-date:')
      }
    }
  } catch (err) {
    console.error('Error updating MongoDB:', err)
  }
}

const test = async (scrapedData) => {
  try {
    // Step 1: Extract dates and team names to create unique keys
    const matchupKeys = scrapedData.map(({ date, visitingTeam, homeTeam }) => ({
      key: `${new Date(date).toISOString()}|${visitingTeam.name}|${
        homeTeam.name
      }`,
      visitingScore: visitingTeam.score,
      homeScore: homeTeam.score,
    }))

    // Step 2: Fetch all existing matchups at once
    const existingMatchups = await Matchup.find({
      date: { $in: matchupKeys.map((item) => new Date(item.date)) },
      'visitingTeam.name': {
        $in: matchupKeys.map((item) => item.visitingTeam.name),
      },
      'homeTeam.name': { $in: matchupKeys.map((item) => item.homeTeam.name) },
    })

    // Step 3: Create a map for quick access to existing matchups
    const matchupMap = existingMatchups.reduce((map, matchup) => {
      const key = `${matchup.date.toISOString()}|${matchup.visitingTeam.name}|${
        matchup.homeTeam.name
      }`
      map[key] = matchup
      return map
    }, {})

    // Step 4: Prepare bulk operations for updates
    const bulkOps = []

    for (const scrapedItem of scrapedData) {
      const { date: scrapedDate, visitingTeam, homeTeam } = scrapedItem
      const key = `${new Date(scrapedDate).toISOString()}|${
        visitingTeam.name
      }|${homeTeam.name}`

      const existingMatchup = matchupMap[key]

      if (!existingMatchup) {
        console.error('Matchup not found for the given data:', scrapedItem)
        continue // Skip to the next item in the array
      }

      // Prepare the update if scores are different
      if (
        existingMatchup.visitingTeam.score !== visitingTeam.score ||
        existingMatchup.homeTeam.score !== homeTeam.score
      ) {
        bulkOps.push({
          updateOne: {
            filter: { _id: existingMatchup._id },
            update: {
              $set: {
                'visitingTeam.score': visitingTeam.score,
                'homeTeam.score': homeTeam.score,
              },
            },
          },
        })
      } else {
        console.log('Matchup already up-to-date for:', scrapedItem)
      }
    }

    // Step 5: Execute all updates in a single bulk operation
    if (bulkOps.length > 0) {
      const result = await Matchup.bulkWrite(bulkOps)
      console.log(`${result.modifiedCount} matchups updated successfully.`)
    } else {
      console.log('No updates were necessary.')
    }
  } catch (err) {
    console.error('Error updating MongoDB:', err)
  }
}

module.exports = { updateMatchupScores, getMatchupData, test }
