/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('book', {
    'id': {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
      comment: "null"
    },
    'cate': {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "null"
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
      type: "YEAR",
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
    'createdDate': {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "null"
    }
  }, {
    tableName: 'book',
    timestamps: false
  });
};
