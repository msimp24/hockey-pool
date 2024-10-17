const express = require('express')
const matchupController = require('../controllers/matchupController')
const { authenticate } = require('../middlewares/authenticate')
const { poolAccess } = require('./../middlewares/poolAccess')
const router = express.Router()

router
  .route('/')
  .get(matchupController.getAllMatchups)
  .post(matchupController.addNewMatchup)

router
  .route('/weekly/:year/:week')
  .get(authenticate, poolAccess, matchupController.getWeeklyMatchups)

router
  .route('/:id')
  .get(matchupController.getMatchupById)
  .patch(matchupController.updateMatch)
  .delete(matchupController.deleteMatchup)

module.exports = router
