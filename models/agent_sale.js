'use strict';
module.exports = (sequelize, DataTypes) => {
  const agent_sale = sequelize.define('agent_sale', {
    agent_child_id: DataTypes.INTEGER,
    agent_name: DataTypes.STRING,
    referal_fee: DataTypes.DOUBLE,
    transaction_fee: DataTypes.DOUBLE,
    status: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN
  }, {
    
  });
  agent_sale.associate = function(models) {
    // associations can be defined here
    agent_sale.belongsTo(models.agent_child, { as: 'child_agent', foreignKey: 'agent_child_id' , targetKey:'id'}); 
  };
  return agent_sale;
};