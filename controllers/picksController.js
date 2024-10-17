const Pick = require('./../models/Pick')
const User_Pool = require('./../models/User_Pool')
const Matchup = require('./../models/Matchup')

const makePick = async (req, res) => {
  const userPoolId = req.userPool._id
  const { matchupId, weekNumber, selectedTeam } = req.body

  try {
    // Find existing pick for this week and matchup (optional)
    let existingPick = await Pick.findOne({
      userPoolId,
      week: weekNumber,
    })

    // Update existing pick if found (including matchupId)
    if (existingPick) {
      existingPick.matchupId = matchupId
      existingPick.selectedTeam = selectedTeam || null // Set to null if not provided
      await existingPick.save()
    } else {
      // Create a new pick if no existing pick found
      existingPick = new Pick({
        userPoolId,
        matchupId,
        selectedTeam: selectedTeam || null,
        week: weekNumber,
      })

      await existingPick.save()
    }

    // Update userPool.weeklyPicks only if necessary (avoid redundant updates)
    const userPool = await User_Pool.findById(userPoolId)

    if (!userPool) {
      return res.status(404).json({
        message: 'Could not find a user in this pool',
      })
    }
    // Update userPool.weeklyPicks[weekNumber] only if the selectedTeam changed
    userPool.weeklyPicks[weekNumber] = selectedTeam || null
    await userPool.save()
    res.status(201).json({
      status: 'success',
      message: selectedTeam ? 'Pick created successfully' : 'Matchup selected', // Adjust message based on selection
      pick: existingPick, // Include pick details in response
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err.message,
    })
  }
}

const getPickByWeek = async (req, res) => {
  const userPoolId = req.userPool._id
  const week = req.params.week

  try {
    const pick = await Pick.findOne({ userPoolId, week: week })

    if (!pick) {
      return res.status(200).json({
        message: 'Could not find a pick from this user',
        success: false,
      })
    }

    const matchup = await Matchup.findById(pick.matchupId)

    if (!matchup) {
      return res.status(404).json({
        message: 'Could not find a matchup with that id',
        pick: null,
        matchup: null,
        success: false,
      })
    }

    res.status(200).json({
      status: 'success',
      pick,
      matchup,
      success: true,
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err.message,
    })
  }
}
const updatePicksPerWeek = async (req, res) => {
  const week = Number(req.params.week)
  try {
    const picks = await Pick.aggregate([
      {
        $match: {
          week,
        },
      },
      {
        $lookup: {
          from: 'matchups',
          localField: 'matchupId',
          foreignField: '_id',
          as: 'matchup',
        },
      },
      {
        $unwind: '$matchup',
      },
      {
        $project: {
          _id: 1,
          userPoolId: 1,
          matchup: 1,
          selectedTeam: 1,
          isCorrect: 1,
        },
      },
    ])

    picks.forEach((pick) => {
      let winningTeam = ''
      let result

      if (pick.matchup.visitingTeam.score > pick.matchup.homeTeam.score) {
        winningTeam = pick.matchup.visitingTeam.name
      } else {
        winningTeam = pick.matchup.homeTeam.name
      }

      if (pick.selectedTeam === winningTeam) {
        result = true
      } else {
        result = false
      }

      pick.isCorrect = result
    })

    const bulkOps = picks.map((pick) => ({
      updateOne: {
        filter: { _id: pick._id },
        update: { $set: { isCorrect: pick.isCorrect } },
      },
    }))

    await Pick.bulkWrite(bulkOps)

    const userPoolsToUpdate = await User_Pool.find({
      /* Define filter if needed */
    })

    const bulkUserPoolOps = userPoolsToUpdate
      .map((pool) => {
        const incorrectPicksCount = picks.filter(
          (pick) => pick.userPoolId.equals(pool._id) && !pick.isCorrect
        ).length
        if (incorrectPicksCount > 0) {
          return {
            updateOne: {
              filter: { _id: pool._id },
              update: { $inc: { lives: -incorrectPicksCount } },
            },
          }
        } else {
          return null
        }
      })
      .filter((op) => op !== null) // Remove null operations

    await User_Pool.bulkWrite(bulkUserPoolOps)

    res.status(200).json({
      status: 'success',
      success: true,
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err.message,
    })
  }
}

module.exports = { makePick, getPickByWeek, updatePicksPerWeek }
