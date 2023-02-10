const express = require('express')

const {
  GetAllBooks,
  GetBook,
  CreateBook,
  DeleteBook,
  UpdateBook,
  register,
  auth,
  userUpdate,
} = require('../controllers')
const { hasExist } = require('../middleware/book.middleware')
const { uploadMedia } = require('../middleware/mediaFile')
const {
  reqIsValid,
  bookValid,
  userLoginValid,
  userValid,
  updateUserValid,
} = require('../middleware/requestValid')
const {
  hasAlreadyUser,
  hasExistUser,
  verifyToken,
} = require('../middleware/user.middleware')

const Route = express.Router()

Route.post('/register', [reqIsValid(userValid), hasAlreadyUser], register)
Route.post('/login', [reqIsValid(userLoginValid), hasExistUser], auth)
Route.post(
  '/user',
  [verifyToken, uploadMedia, reqIsValid(updateUserValid)],
  userUpdate
)

Route.get('/', GetAllBooks)
Route.get('/:id', [verifyToken, hasExist], GetBook)
Route.delete('/:id', [verifyToken, hasExist], DeleteBook)
Route.put('/:id', [verifyToken, hasExist], UpdateBook)
Route.post('/book', [verifyToken, reqIsValid(bookValid)], CreateBook)

module.exports = Route
