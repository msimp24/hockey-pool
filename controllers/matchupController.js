const Matchup = require('./../models/Matchup')

const getMatchupData = async () => {
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
      gameId: index,
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
}

const addNewMatchUp = async (req, res) => {
  const { gameNumber, date, visitingTeamName, homeTeamName } = req.body

  try {
  } catch (err) {}
}

const getAllMatchups = async (req, res) => {}
