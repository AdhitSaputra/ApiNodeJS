const Content = require('../models/content.model')

async function hasExist(req, res, next) {
  query = await Content.count({ where: { id: req.params.id } })
  if (query != 0) {
    next()
    return
  }
  res.status(404).json({
    status: 404,
    message: 'Not found!',
  })
}

module.exports = {
  hasExist,
}
