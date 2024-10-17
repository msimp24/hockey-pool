const express = require('express')
const poolController = require('../controllers/poolController')
const { authenticate } = require('../middlewares/authenticate')
const { poolAccess } = require('./../middlewares/poolAccess')
const router = express.Router()

router.route('/').get(poolController.getAllPools)

router.route('/create-pool').post(authenticate, poolController.createNewPool)

router
  .route('/:id')
  .get(authenticate, poolAccess, poolController.getPoolById)
  .patch(poolController.updatePool)
  .delete(poolController.deletePool)

module.exports = router
