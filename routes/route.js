const express = require('express')

const schema = require('../middleware/schema.validator')

const { register, auth, userUpdate } = require('../controllers')
const { hasExist } = require('../middleware/content.middleware')
const upload = require('../middleware/mediaFile')
const {
  hasAlreadyUser,
  hasExistUser,
  verifyToken,
} = require('../middleware/user.middleware')
const { onlyAdmin } = require('../middleware/admin')
const {
  getAllContent,
  createContent,
  getContent,
  updateContent,
  deleteContent,
} = require('../controllers/content.controller')
const { deleteUser } = require('../controllers/user.controller')

const Route = express.Router()
const Schema = schema(true)

Route.post('/register', [Schema, hasAlreadyUser], register)
Route.post('/login', [Schema, hasExistUser], auth)
Route.put('/user', [verifyToken, Schema, upload], userUpdate)
Route.delete('/user/:id', [verifyToken, onlyAdmin], deleteUser)

Route.get('/content', getAllContent)
Route.post('/content/create', [verifyToken, Schema], createContent)
Route.get('/content/:id', [verifyToken, hasExist], getContent)
Route.put('/content/:id', [verifyToken, hasExist, Schema], updateContent)
Route.delete('/content/:id', [verifyToken, hasExist], deleteContent)

module.exports = Route
