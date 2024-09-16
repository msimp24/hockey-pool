const mongoose = require('mongoose')

const poolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sport: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endData: {
    type: Date,
  },
  startingLives: {
    type: Number,
    required: true,
  },
  entryCode: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Pool', poolSchema)
