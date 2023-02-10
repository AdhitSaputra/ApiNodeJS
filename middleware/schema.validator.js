const _ = require('lodash')
const schema = require('./schema')

module.exports = (useErrorJoi = false) => {
  // useErrorJoi determines is we should respond with the base error
  // Boolean: defaults to FALSE
  const _useErrorJoi = useErrorJoi

  // enable HTTP methods for requests [POST, PUT]
  const _supportedMethods = ['post', 'put']

  // Joi valodation options
  const _validationOption = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allo unknown key
    stripUnknown: true, //
  }

  //return validation middleware
  return (req, res, next) => {
    const route = req.route.path
    const method = req.method.toLowerCase()

    if (_.includes(_supportedMethods, method) && _.has(schema, route)) {
      const _schema = _.get(schema, route)

      if (_schema) {
        // Validate req.body using the schema and validation options
        const { error } = _schema.validate(req.body, _validationOption)
        if (error) {
          const JoiError = {
            status: 422,
            error: {
              original: error._object,
              details: _.map(error.details, ({ message, type }) => ({
                message: message.replace(/['"]/g, ''),
                type,
              })),
            },
          }

          const CustomError = {
            status: 422,
            error: 'Invalid request!',
          }

          return res.status(422).json(_useErrorJoi ? JoiError : CustomError)
        }
        return next()
      }
    }
    return next()
  }
}
