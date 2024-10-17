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
  time: {
    type: String,
    required: true,
  },
  visitingTeam: {
    name: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
    },
  },
  homeTeam: {
    name: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
    },
  },
})

module.exports = mongoose.model('Matchup', matchupSchema)
