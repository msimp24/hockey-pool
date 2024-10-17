const User_Pool = require('./../models/User_Pool')

const poolAccess = async (req, res, next) => {
  const userId = req.user.id
  try {
    const userPool = await User_Pool.findOne({ userId: userId })
    if (!userPool) {
      return res.status(404).json({
        status: 'failed',
        message: 'you are not authorized',
      })
    }
    req.userPool = userPool
    next()
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err.message,
    })
  }
}

module.exports = { poolAccess }
