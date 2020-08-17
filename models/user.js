/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'username': {
      type: DataTypes.STRING(45),
      allowNull: false,
      comment: "null",
      unique: true
    },
    'password': {
      type: DataTypes.STRING(60),
      allowNull: true,
      comment: "null"
    },
    'name': {
      type: DataTypes.STRING(60),
      allowNull: true,
      comment: "null"
    },
    'class': {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "null"
    },
    'birthday': {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "null"
    },
    'email': {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "null"
    },
    'address': {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "null"
    },
    'expiredDate': {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "null"
    },
    'createdAt': {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "null"
    },
    'updatedAt': {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "null"
    },
    'role': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'user'
  });
};
