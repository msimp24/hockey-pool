const Matchup = require('./../models/Matchup')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// returns all matchups in the NHL 2024-2025 season
const getAllMatchups = async (req, res) => {
  try {
    const matchups = await Matchup.find({})

    const scrapedData = await getMatchupData()

    const updatedMatchups = await updateMatchupScores(scrapedData)

    res.status(400).json({
      status: 'success',
      updateMatchups,
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err,
    })
  }
}
const getMatchupById = async (req, res) => {
  const id = req.params.id

  try {
    const match = await Matchup.findById(id)

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
      id,
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
      match,
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

const getWeeklyMatchups = async (req, res) => {
  const year = Number(req.params.year)
  const week = Number(req.params.week)
  console.log(year, week)
  try {
    const match = await Matchup.aggregate([
      {
        $project: {
          homeTeam: 1,
          visitingTeam: 1,
          date: 1,
          year: {
            $year: '$date',
          },
          week: {
            $week: '$date',
          },
          dayOfWeek: {
            $dayOfWeek: '$date',
          },
        },
      },
      {
        $match: {
          dayOfWeek: 7,
          year: year,
          week: week,
        },
      },
      {
        $sort: {
          year: 1,
          week: 1,
        },
      },
      {
        $group: {
          _id: {
            year: '$year',
            week: '$week',
          },
          saturdayMatchups: {
            $push: '$$ROOT',
          },
        },
      },
    ])

    if (!match) {
      return res.status(404).json({
        status: 'failed',
        message: 'Could not find any documents',
      })
    }

    res.status(200).json({
      status: 'success',
      match,
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err.message,
    })
  }
}

module.exports = {
  getAllMatchups,
  getMatchupById,
  updateMatch,
  addNewMatchup,
  deleteMatchup,
  getWeeklyMatchups,
}
