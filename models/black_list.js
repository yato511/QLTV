/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('black_list', {
    'id': {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "null"
    },
    'userId': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    },
    'date': {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'black_list'
  });
};
