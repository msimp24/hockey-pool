const express = require('express')
const userAuth = require('../controllers/authController')
const { authenticate } = require('../middlewares/authenticate')
const router = express.Router()

router.route('/register').post(userAuth.registerUser)
router.route('/login').post(userAuth.loginUser)

module.exports = router
