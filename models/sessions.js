/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sessions', {
    'session_id': {
      type: DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
      comment: "null"
    },
    'expires': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      comment: "null"
    },
    'data': {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'sessions'
  });
};
