const express = require('express')
const userPoolController = require('../controllers/userPoolController')
const { authenticate } = require('../middlewares/authenticate')
const router = express.Router()

router
  .route('/join/:poolId')
  .post(authenticate, userPoolController.addUserToPool)

module.exports = router
