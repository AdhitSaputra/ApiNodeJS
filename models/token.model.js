const { Model, DataTypes, Op } = require('sequelize')
const sequelize = require('./config')
const User = require('./user.model')

class Token extends Model {
  toJSON() {
    let attributes = Object.assign({}, this.get())
    delete attributes.id
    return attributes
  }
}

Token.init(
  {
    raw: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exp: {
      type: DataTypes.DATE,
      defaultValue: () => {
        return Math.floor(Date.now() / 1000) + 60 * 60 * 24
      },
    },
    iat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'tokens',
    tableName: 'token',
    timestamps: false,
    getterMethods: {
      isExpired() {
        return this.exp <= Math.floor(Date.now() / 1000)
      },
    },
    scopes: {
      gteExpired: {
        where: {
          exp: {
            [Op.gte]: Math.floor(Date.now() / 1000),
          },
        },
        attributes: ['raw'],
      },
    },
  }
)

Token.belongsTo(User)

module.exports = Token
