/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('borrow_detail', {
    'id': {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
      comment: "null"
    },
    'userId': {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      comment: "null",
      references: {
        model: 'user',
        key: 'id'
      }
    },
    'bookId': {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "null",
      references: {
        model: 'book',
        key: 'id'
      }
    },
    'confirmBorrow': {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0',
      comment: "null"
    },
    'returnDate': {
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
    }
  }, {
    tableName: 'borrow_detail'
  });
};
