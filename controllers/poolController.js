const Pool = require('./../models/Pool')
const User_Pool = require('./../models/User_Pool')

// creates a new pool
const createNewPool = async (req, res) => {
  const {
    name,
    sport,
    startDate,
    endDate,
    teamName,
    startingLives,
    entryCode,
  } = req.body
  try {
    const pool = new Pool({
      name,
      sport,
      startDate,
      endDate,
      startingLives,
      entryCode,
    })
    await pool.save()

    if (!pool) {
      return res.status(404).json({
        status: 'failed',
        message: 'Unable to create pool',
      })
    }

    const userPool = new User_Pool({
      userId: req.user.id,
      poolId: pool._id,
      teamName: teamName,
      lives: startingLives,
    })

    await userPool.save()

    res.status(200).json({
      status: 'success',
      data: pool,
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err,
    })
  }
}
// get all pools
const getAllPools = async (req, res) => {
  try {
    const pools = await Pool.find({})

    res.status(400).json({
      status: 'success',
      pools,
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err,
    })
  }
}

// get pool by ID
const getPoolById = async (req, res, next) => {
  try {
    const pool = await Pool.findById(req.params.id)

    if (!pool) {
      res.status(404).json({
        status: 'failed',
        message: 'Could not find a pool with that Id',
      })
    }

    res.status(200).json({
      message: 'success',
      data: {
        pool,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

//update a pool
const updatePool = async (req, res) => {
  try {
    const pool = await Pool.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (!pool) {
      res.status(404).json({
        status: 'failed',
        message: 'Could not find a pool with that Id',
      })
    }
    res.status(200).json({
      message: 'success',
      data: {
        pool,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

//delete pool

const deletePool = async (req, res) => {
  try {
    const pool = await Pool.findByIdAndDelete(req.params.id)

    if (!pool) {
      res.status(404).json({
        status: 'failed',
        message: 'Could not find a pool with that Id',
      })
    }
    res.status(200).json({
      message: 'success',
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

module.exports = {
  createNewPool,
  getAllPools,
  updatePool,
  getPoolById,
  deletePool,
}
