const Pick = require('./../models/Pick.js')
const User_Pool = require('./../models/User_Pool.js')

const updatePicksForWeek = async (week) => {
  try {
    console.log(week)
    // Fetch picks and join with matchups
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

    console.log(picks)

    // Determine correctness of picks
    picks.forEach((pick) => {
      let winningTeam = ''
      if (pick.matchup.visitingTeam.score > pick.matchup.homeTeam.score) {
        winningTeam = pick.matchup.visitingTeam.name
      } else {
        winningTeam = pick.matchup.homeTeam.name
      }

      pick.isCorrect = pick.selectedTeam === winningTeam
    })

    // Prepare bulk update operations for picks
    const bulkOps = picks.map((pick) => ({
      updateOne: {
        filter: { _id: pick._id },
        update: { $set: { isCorrect: pick.isCorrect } },
      },
    }))

    // Perform the bulk update
    await Pick.bulkWrite(bulkOps)

    return picks // Return the updated picks to use in user pool updates
  } catch (err) {
    throw new Error(err.message)
  }
}

const updateUserPools = async (picks) => {
  try {
    // Get user pools that may need to be updated
    const userPoolsToUpdate = await User_Pool.find({
      /* Define filter if needed */
    })

    // Prepare bulk update operations for user pools
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

    // Perform the bulk update for user pools
    await User_Pool.bulkWrite(bulkUserPoolOps)

    return { success: true } // Return success indicator
  } catch (err) {
    throw new Error(err.message)
  }
}

const updatePicks = async (week) => {
  try {
    const updatedPicks = await updatePicksForWeek(week)
    await updateUserPools(updatedPicks)
    console.log('Picks and user pools successfully updated')
  } catch (error) {
    console.error('Error updating picks or user pools:', error.message)
  }
}

module.exports = { updatePicksForWeek, updateUserPools, updatePicks }
