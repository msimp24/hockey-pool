const mongoose = require('mongoose')

const user_poolSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: String,
  },
  poolId: {
    type: String,
    required: true,
  },
  lives: {
    type: Number,
    required: true,
    default: 2,
  },
})

module.exports = mongoose.model('User_Pool', user_poolSchema)
