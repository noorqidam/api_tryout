'use strict';
module.exports = (sequelize, DataTypes) => {
  const agent_master_point = sequelize.define('agent_master_point', {
    agent_master_id: DataTypes.INTEGER,
    saldo: DataTypes.DOUBLE
  }, {});
  agent_master_point.associate = function(models) {
    // associations can be defined here
  };
  return agent_master_point;
};