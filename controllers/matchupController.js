const Matchup = require('./../models/Matchup')

// returns all matchups in the NHL 2024-2025 season
const getAllMatchups = async (req, res) => {
  try {
    const matchups = await Matchup.find({})

    res.status(400).json({
      status: 'success',
      matchups,
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err,
    })
  }
}
const getMatchupByGameNumber = async (req, res) => {
  const gameNumber = req.params

  try {
    const match = await Matchup.find(gameNumber)

    if (!match) {
      res.status(500).json({
        status: 'failed',
        message: 'Cannot find a matchup with this game number',
      })
    }

    res.status(200).json({
      status: 'Success',
      match,
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      gameNumber,
    })
  }
}

//update a matchup
const updateMatch = async (req, res) => {
  const { gameNumber, date, time, visitingTeam, homeTeam } = req.body

  try {
    const matchup = new Matchup({
      gameNumber,
      date,
      time,
      visitingTeam,
      homeTeam,
    })

    const matchupUpdated = Matchup.updateOne(
      {
        gameNumber: gameNumber,
      },
      matchup
    )

    if (!matchupUpdated) {
      return res.status(404).json({
        message: 'Could not find an match with that game number',
      })
    }

    res.status(200).json({
      message: 'success',
      data: {
        matchup,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}
// adds a new matchup
const addNewMatchup = async (req, res) => {
  const matchData = req.body
  try {
    const match = await Matchup.create(matchData)

    res.status(200).json({
      message: 'Success',
      data: match,
    })
  } catch (err) {
    res.status(401).json({
      status: 'failed',
      message: err.message,
    })
  }
}

const deleteMatchup = async (req, res) => {
  const gameNumber = req.params.gameNumber

  try {
    const match = await Matchup.deleteOne({
      gameNumber: gameNumber,
    })
    if (match.deletedCount == 1) {
      res.status(200).json({
        status: 'Success',
        message: `Document ${gameNumber} was successfully deleted`,
      })
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'Could not find a document with that game number',
      })
    }
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err,
    })
  }
}

module.exports = {
  getAllMatchups,
  getMatchupByGameNumber,
  updateMatch,
  addNewMatchup,
  deleteMatchup,
}
