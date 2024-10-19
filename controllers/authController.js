const User = require('../models/User')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
  const { email, password, firstName, lastName, teamName } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        status: 'failed',
        message: 'Account already created with this email',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      teamName,
    })

    await newUser.save()

    res.status(201).json({
      status: 'Success',
    })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err,
    })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  console.log(email, password)
  try {
    const user = await User.findOne({ email }, { password: 1 })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    })

    res.json({ token })
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err,
    })
  }
}

module.exports = { registerUser, loginUser }
