const { User } = require('../models')

async function onlyAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      status: 403,
      message: "you don't have permission to access this page!",
    })
  }
  return next()
}

async function onlyStaff(req, res, next) {
  if (!(req.user.isStaff || req.user.isAdmin)) {
    return res.status(403).json({
      status: 403,
      message: 'you don\t havr permission to access this page!',
    })
  }
  return next()
}

module.exports = {
  onlyAdmin,
  onlyStaff,
}
