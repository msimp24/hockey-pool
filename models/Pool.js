const mongoose = require('mongoose')

const poolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sport: {
    type: String,
    default: 'Hockey',
  },
  startDate: {
    type: Date,
  },
  endData: {
    type: Date,
  },
})

module.exports = mongoose.model('Pool', poolSchema)
