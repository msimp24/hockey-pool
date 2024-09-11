const mongoose = require('mongoose')

const pickSchema = new mongoose.Schema({
  user_pool_id: {
    type: String,
    required: true,
  },
  matchup_id: {
    type: String,
    required: true,
  },
  selectedTeam: {
    type: String,
    required: true,
  },
  week: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model('Pick', pickSchema)
