'use strict';
module.exports = (sequelize, DataTypes) => {
  const agent_child_point = sequelize.define('agent_child_point', {
    agent_child_id: DataTypes.INTEGER,
    saldo: DataTypes.DOUBLE
  }, {});
  agent_child_point.associate = function(models) {
    // associations can be defined here
  };
  return agent_child_point;
};