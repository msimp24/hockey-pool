const mongoose = require('mongoose')

const user_poolSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  poolId: {
    type: mongoose.Schema.Types.ObjectId,
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
