const express = require('express')
const userPoolController = require('../controllers/userPoolController')
const { authenticate } = require('../middlewares/authenticate')
const { poolAccess } = require('../middlewares/poolAccess')
const router = express.Router()

router.route('/').get(authenticate, poolAccess, userPoolController.getUserPool)

router.route('/join').post(authenticate, userPoolController.addUserToPool)

router.route('/:id/remove').patch(userPoolController.removeLifeFromUser)

router
  .route('/get-pool-data')
  .get(authenticate, poolAccess, userPoolController.getUserPoolData)

module.exports = router
