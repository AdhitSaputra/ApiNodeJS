const multer = require('multer')
const path = require('path')
const util = require('util')
const fs = require('fs')

class FileTypeNotAllowed extends Error {
  constructor(message) {
    super(message)
  }
}

const maxSize = 10 * 1024 * 1024 // max size upload 10mb

const opt = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(
      null,
      path.join(process.cwd() + process.env.MEDIA_STATIC || 'static')
    )
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + '-' + file.originalname)
  },
})

const uploadMedia = multer({
  storage: opt,
  limits: { fieldSize: maxSize },
  fileFilter: (req, file, callback) => {
    const fileType = /jpeg|jpg|png|gif/g
    const mimetype = fileType.test(file.mimetype)
    const ext = fileType.test(path.extname(file.originalname))

    if (mimetype || ext) {
      return callback(null, true)
    }
    return callback(
      new FileTypeNotAllowed('filetype must be [jpeg, jpg, png, gif]')
    )
  },
}).single('avatar')

function upload(req, res, next) {
  uploadMedia(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err)
    } else if (err instanceof FileTypeNotAllowed) {
      return res.status(400).json({
        status: 400,
        message: err.message,
      })
    }
    return next()
  })
}

module.exports = upload
