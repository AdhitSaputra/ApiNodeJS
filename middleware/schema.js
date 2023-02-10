const Joi = require('joi')

const bookValid = Joi.object({
  name: Joi.string().required(),
})

const userRegister = Joi.object({
  firstname: Joi.string().min(2).required(),
  lastname: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(16).required(),
})

const userLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const updateUser = Joi.object({
  password: Joi.string().min(6).max(16),
  avatar: Joi.string().uri(),
})

const content = Joi.object({
  title: Joi.string().min(2).required(),
  body: Joi.string().min(10).required(),
})

//.messages({ 'object.missing': 'invalid request!' })

module.exports = {
  '/register': userRegister,
  '/login': userLogin,
  '/user': updateUser,
  '/content/create': content,
  '/content/:id': content,
}
