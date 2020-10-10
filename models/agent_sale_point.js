'use strict';
module.exports = (sequelize, DataTypes) => {
  const agent_sale_point = sequelize.define('agent_sale_point', {
    agent_sale_id: DataTypes.INTEGER,
    saldo: DataTypes.DOUBLE
  }, {});
  agent_sale_point.associate = function(models) {
    // associations can be defined here
  };
  return agent_sale_point;
};