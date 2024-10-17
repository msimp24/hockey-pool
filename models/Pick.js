const mongoose = require('mongoose')

const pickSchema = new mongoose.Schema({
  userPoolId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  matchupId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  selectedTeam: {
    type: String,
  },
  week: {
    type: Number,
    required: true,
  },
  isCorrect: {
    type: Boolean,
  },
})

module.exports = mongoose.model('Pick', pickSchema)
