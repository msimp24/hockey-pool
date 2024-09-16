const User_Pool = require('./../models/User_Pool')
const Pool = require('./../models/Pool')

const addUserToPool = async (req, res) => {
  const userId = req.user.id
  const poolId = req.params.poolId
  const entryCode = req.body.entryCode

  console.log(userId)

  try {
    const pool = await Pool.findById(poolId)
    if (!pool) {
      return res.status(404).json({
        status: 'failed',
        message: 'Pool not found',
      })
    }

    if (pool.entryCode !== entryCode) {
      return res.status(403).json({
        status: 'failed',
        message: 'Invalid entry code',
      })
    }
    const existingUser = await User_Pool.findOne({ userId, poolId })
    if (existingUser) {
      return res.status(400).json({
        status: 'failed',
        message: 'You are already in this pool',
      })
    }
    const userPool = new User_Pool({
      userId,
      poolId,
      teamName: req.body.teamName,
      lives: pool.startingLives,
    })
    await userPool.save()

    res.status(200).json({
      status: 'success',
      userPoolr,
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      err: err.message,
    })
  }
}

module.exports = { addUserToPool }
