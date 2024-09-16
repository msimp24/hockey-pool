const express = require('express')
const matchupController = require('../controllers/matchupController')
const { authenticate } = require('../middlewares/authenticate')
const router = express.Router()

router
  .route('/')
  .get(matchupController.getAllMatchups)
  .post(matchupController.addNewMatchup)

router
  .route('/:gameNumber')
  .get(matchupController.getMatchupByGameNumber)
  .patch(matchupController.updateMatch)
  .delete(matchupController.deleteMatchup)

module.exports = router
