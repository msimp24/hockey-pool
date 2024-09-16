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
  teamName: {
    type: String,
    required: true,
  },
  weeklyPicks: {
    type: [String],
  },
  lives: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model('User_Pool', user_poolSchema)
