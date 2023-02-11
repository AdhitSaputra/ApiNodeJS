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
          exclude: ['password'],
        },
      },
    },
  }
)

User.hasMany(Content, { onDelete: 'CASCADE' })
Content.belongsTo(User)

module.exports = Content
