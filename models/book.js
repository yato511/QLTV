/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('book', {
    'id': {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
      comment: "null"
    },
    'cateId': {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      comment: "null",
      references: {
        model: 'category',
        key: 'id'
      }
    },
    'title': {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "null"
    },
    'author': {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "null"
    },
    'publisher': {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "null"
    },
    'publishYear': {
      type: "YEAR(4)",
      allowNull: true,
      comment: "null"
    },
    'note': {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "null"
    },
    'isAvailable': {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1',
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
    }
  }, {
    tableName: 'book'
  });
};
