const { Op } = require('sequelize')
const Content = require('../models/content.model')

async function getAllContent(req, res) {
  var query = req.query.search || ''

  const content = await Content.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.substring]: query } },
        { body: { [Op.substring]: query } },
      ],
    },
  })
  return res.status(200).json({
    status: 200,
    data: content,
  })
}

async function createContent(req, res) {
  const content = await Content.create({ ...req.body, userId: req.user.id })

  return res.status(201).json({
    status: 201,
    data: content,
  })
}

async function getContent(req, res) {
  const content = await Content.findByPk(req.params.id)
  return res.status(200).json({
    status: 200,
    data: content,
  })
}

async function updateContent(req, res) {
  const content = await Content.findByPk(req.params.id)
  await content.update(req.body)
  return res.status(200).json({
    status: 200,
    data: content,
  })
}

async function deleteContent(req, res) {
  await Content.destroy({ where: { id: req.params.id } })
  return res.status(204).json({
    status: 204,
  })
}

module.exports = {
  getAllContent,
  createContent,
  getContent,
  updateContent,
  deleteContent,
}
