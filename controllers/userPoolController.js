const User_Pool = require('./../models/User_Pool')
const Pool = require('./../models/Pool')
const mongoose = require('mongoose')

const addUserToPool = async (req, res) => {
  const userId = req.user.id
  const entryCode = req.body.entryCode

  try {
    // Find the pool by entry code
    const pool = await Pool.findOne({ entryCode })
    if (!pool) {
      return res.status(404).json({
        status: 'failed',
        message: 'Pool not found',
      })
    }

    // Rest of the logic remains the same ...

    // ... check entry code validity
    if (pool.entryCode !== entryCode) {
      return res.status(403).json({
        status: 'failed',
        message: 'Invalid entry code',
      })
    }

    // ... check for existing user
    const existingUser = await User_Pool.findOne({ userId, poolId: pool._id }) // Use pool._id here
    if (existingUser) {
      return res.status(400).json({
        status: 'failed',
        message: 'You are already in this pool',
      })
    }

    // ... create and save userPool
    const userPool = new User_Pool({
      userId,
      poolId: pool._id,
      teamName: req.body.teamName,
      lives: pool.startingLives,
    })
    await userPool.save()

    res.status(200).json({
      status: 'success',
      userPool,
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      err: err.message,
    })
  }
}

const removeLifeFromUser = async (req, res) => {
  try {
    const userPool = await User_Pool.findById(req.params.id)
    if (!userPool) {
      return res.status(404).json({ error: 'User pool not found' })
    }

    // Check if the user has any remaining lives
    if (userPool.lives <= 0) {
      return res.status(400).json({ error: 'User has no remaining lives' })
    }

    // Remove a life
    userPool.lives--
    await userPool.save()

    res.json(userPool)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

//Provides data for the pool that the user is currently a part of.
const getUserPoolData = async (req, res) => {
  const poolId = req.userPool.poolId

  try {
    const poolData = await User_Pool.aggregate([
      {
        $lookup: {
          from: 'pools',
          localField: 'poolId',
          foreignField: '_id',
          as: 'poolData',
        },
      },
      {
        $unwind: {
          path: '$poolData',
        },
      },
      {
        $project: {
          poolId: 1,
          teamName: 1,
          weeklyPicks: 1,
          lives: 1,
          poolName: '$poolData.name',
          poolSport: '$poolData.sport',
        },
      },
      {
        $match: {
          poolId: { $eq: new mongoose.Types.ObjectId(poolId) },
        },
      },
    ])

    res.status(200).json({
      status: 'success',
      data: poolData,
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err.message,
    })
  }
}

//provides data for the specific user that is logged in.
const getUserPool = async (req, res) => {
  const userId = req.user._id

  if (userId === null) {
    return res.status(401).json({
      status: 'failed',
      message: 'User is not part of any pool',
    })
  }

  const userPool = await User_Pool.find({ userId: userId })

  if (!userPool) {
    return res.status(401).json({
      status: 'failed',
      message: 'Could not find a user pool matched to that user id',
    })
  }

  try {
    res.status(200).json({
      status: 'success',
      userPool,
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err.message,
    })
  }
}

const getWeeklyPicksData = async (req, res) => {
  const userPool = req.user
}

module.exports = {
  addUserToPool,
  removeLifeFromUser,
  getUserPoolData,
  getUserPool,
}
