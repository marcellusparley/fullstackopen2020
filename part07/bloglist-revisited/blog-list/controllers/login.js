// Router for handling login
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

// Logging in user
loginRouter.post('/', async (request, response) => {
  const body = request.body

  // Finds and checks that user exists, and that the password provided is correct
  const user = await User.findOne({ username: body.username })
  let passwordCorrect = false

  if (user !== null)
    passwordCorrect = await bcrypt.compare(body.password, user.passwordHash)

  if ( !passwordCorrect )
    return response.status(401).json({ error: 'invalid username or password' })


  // Creates and signs token
  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter