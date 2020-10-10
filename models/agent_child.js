'use strict';
module.exports = (sequelize, DataTypes) => {
  const agent_child = sequelize.define('agent_child', {
    master_agent_id : DataTypes.INTEGER,
    name: DataTypes.STRING,
    hp: DataTypes.CHAR,
    referal_fee: DataTypes.DOUBLE,
    transaction_fee: DataTypes.DOUBLE,
    status : DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN
  }, {});
  agent_child.associate = function(models) {
    // associations can be defined here
    agent_child.belongsTo(models.agent_master, { as: 'master_agent', foreignKey: 'master_agent_id' , targetKey:'id'}); 
  };
  return agent_child;
};