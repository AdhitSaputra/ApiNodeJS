const jwt = require('jsonwebtoken')
const { User } = require('../models')

async function hasAlreadyUser(req, res, next) {
  const query = await User.count({ where: { email: req.body.email } })
  if (query === 0) {
    return next()
  }
  return res.status(409).json({
    status: 409,
    message: `${req.body.email} already exists!`,
  })
}

async function hasExistUser(req, res, next) {
  const { email } = req.body
  console.log(email)
  const query = await User.count({ where: { email: email } })
  if (query != 0) {
    return next()
  }
  return res.status(401).json({
    status: 401,
    message: 'Invalid email or password!',
  })
}

async function verifyToken(req, res, next) {
  const { authorization } = req.headers
  if (authorization) {
    jwt.verify(authorization, process.env.JWT_TOKEN, async (err, decode) => {
      var message
      console.log([err])
      if (err) {
        switch (err.name) {
          case 'TokenExpiredError':
            message = 'Token expired!'
            break
          case 'JsonWebTokenError':
            message = 'Invalid token!'
            break
          default:
            message = 'Something wrong with your token!'
            break
        }
        return res.status(403).json({
          status: 403,
          message: message,
        })
      }
      const user = await User.findByPk(decode.userId)

      if (user) {
        req.user = user
        return next()
      }
    })
  } else {
    return res.status(403).json({
      status: 403,
      message: 'Unauthorized!!',
    })
  }
}

module.exports = { hasAlreadyUser, hasExistUser, verifyToken }
