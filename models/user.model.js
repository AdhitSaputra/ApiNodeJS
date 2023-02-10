const { Model, DataTypes } = require('sequelize')
const path = require('path')
const bcrypt = require('bcrypt')
const sequelize = require('./config')

class User extends Model {
  isUrl(value) {
    const regex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    return regex.test(value)
  }

  passValid(data) {
    return bcrypt.compareSync(data, this.getDataValue('password'))
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
        if (this.getDataValue('email')) {
          throw new Error('email cannot be change!')
        }
        this.setDataValue('email', value)
      },
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'user-default-profil.jpg',
      get() {
        const isurl = this.isUrl(this.getDataValue('avatar'))
        const path = isurl
          ? this.getDataValue('avatar')
          : [process.env.fullUrl, this.getDataValue('avatar')].join('/')
        return path
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 8))
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isStaff: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'users',
    tableName: 'user',
    timestamps: false,
    getterMethods: {
      fullname() {
        return [this.firstname, this.lastname].join(' ')
      },
      pathAvatar() {
        return path.join(
          [
            process.cwd(),
            process.env.MEDIA_STATIC || 'static',
            this.getDataValue('avatar'),
          ].join('/')
        )
      },
    },
  }
)

module.exports = User
