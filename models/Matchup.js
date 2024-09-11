const mongoose = require('mongoose')

const matchupSchema = new mongoose.Schema({
  gameNumber: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  visitingTeam: {
    name: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    required: true,
  },
  homeTeam: {
    name: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    required: true,
  },
})

module.exports = mongoose.model('Matchup', matchupSchema)
