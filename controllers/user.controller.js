const jwt = require('jsonwebtoken')
const fs = require('fs')

const { User, Token } = require('../models')

async function register(req, res) {
  const data = await User.create(req.body)
  return res.status(201).json({
    status: 201,
    data: data,
  })
}

async function auth(req, res) {
  const { email, password } = req.body
  const query = await User.findOne({
    where: { email: email },
  })

  if (!query.passValid(password)) {
    return res.status(401).json({
      status: 401,
      message: 'Invalid email or password!',
    })
  }

  const now = Math.floor(Date.now() / 1000)
  const tokenAPI = await Token.scope('gteExpired').findAndCountAll({
    where: {
      userId: query.id,
    },
  })

  var raw = tokenAPI.rows[0] ? tokenAPI.rows[0].raw : null
  if (tokenAPI.count === 0) {
    raw = jwt.sign(
      {
        userId: query.id,
        iat: now,
      },
      process.env.JWT_TOKEN,
      { expiresIn: now + 60 * 60 }
    )
    Token.create({ raw: raw, userId: query.id, exp: now + 60 * 60 })
  }
  return res.status(200).json({
    status: 200,
    data: {
      token: raw,
      uuid: query.id,
      email: query.email,
      fullname: query.fullname,
    },
  })
}

async function userUpdate(req, res) {
  const lengthBody = Object.keys(req.body).length
  if (!Boolean(lengthBody)) {
    return res.status(400).json({
      status: 400,
      error: { message: 'must contain at least one of [password, avatar]' },
    })
  }

  const user = await User.findByPk(req.user.id)
  console.log(req.file)
  if (req.file) {
    req.body.avatar = req.file.filename
    const path = user.pathAvatar
    await fs.unlink(path, (err) => {
      if (!err) console.log(`File ${path} deleted!`)
    })
  }
  await user.update(req.body)
  return res.status(200).json({
    status: 200,
  })
}

async function deleteUser(req, res) {
  const hasDeleted = await User.destroy({ where: { id: req.params.id } })
  if (hasDeleted) {
    return res.status(204).json({
      status: 204,
    })
  }
  return res.status(404).json({
    status: 404,
    message: 'Data not found!',
  })
}

module.exports = {
  register,
  auth,
  userUpdate,
  deleteUser,
}
