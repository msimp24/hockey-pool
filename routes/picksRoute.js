const express = require('express')
const picksController = require('./../controllers/picksController')
const { authenticate } = require('../middlewares/authenticate')
const { poolAccess } = require('./../middlewares/poolAccess')
const router = express.Router()

router
  .route('/get-pick/:week')
  .get(authenticate, poolAccess, picksController.getPickByWeek)

router
  .route('/all-picks/:week')
  .put(authenticate, poolAccess, picksController.updatePicksPerWeek)

router
  .route('/:id/pick')
  .post(authenticate, poolAccess, picksController.makePick)
router
  .route('/weekly-picks')
  .get(authenticate, poolAccess, picksController.getWeeklyPicksAndResults)

module.exports = router
