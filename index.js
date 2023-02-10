const express = require('express')
const bodyParser = require('body-parser')
const Route = require('./routes/route')
const path = require('path')
const { format } = require('url')

require('dotenv').config()
console.log(__dirname)
const app = express()

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  '/media',
  express.static(
    path.join([process.cwd(), process.env.MEDIA_STATIC || 'static'].join('/'))
  )
)
app.use((req, res, next) => {
  req.fullUrl = format({
    protocol: req.protocol,
    host: req.get('host'),
  })
  process.env.fullUrl = req.fullUrl
  return next()
})
app.use('/', Route)
app.all('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: '404 Not found!',
  })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
