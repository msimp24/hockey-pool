const express = require('express')
const poolController = require('../controllers/poolController')
const { authenticate } = require('../middlewares/authenticate')
const router = express.Router()

router
  .route('/')
  .get(poolController.getAllPools)
  .post(authenticate, poolController.createNewPool)

router
  .route('/:id')
  .get(poolController.getPoolById)
  .patch(poolController.updatePool)
  .delete(poolController.deletePool)

module.exports = router
