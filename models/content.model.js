const { Model, DataTypes } = require('sequelize')
const User = require('./user.model')
const sequelize = require('./config')

class Content extends Model {}

Content.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'contents',
    tableName: 'content',
    timestamps: false,
    defaultScope: {
      include: {
        model: User,
        attributes: {
          exclude: ['pathAvatar', 'password', 'isAdmin', 'isStaff'],
        },
      },
    },
  }
)

Content.belongsTo(User, { foreignKey: 'author', targetKey: 'email' })

module.exports = Content
