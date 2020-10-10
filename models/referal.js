'use strict';
module.exports = (sequelize, DataTypes) => {
  const referal = sequelize.define('referal', {
    sales_agent_id: DataTypes.INTEGER,
    agent_name: DataTypes.STRING,
    referal_code: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    fee: DataTypes.DOUBLE,
    deleted : DataTypes.BOOLEAN
  }, {
    defaultScope : {
      deleted : false
    }
  });
  referal.associate = function(models) {
    // associations can be defined here
    referal.hasMany(models.customer , { as:'customer' , foreignKey: 'referal_code', targetKey :'referal_code'});
    referal.belongsTo(models.agent_sale , { as:'agent_sale' , foreignKey: 'sales_agent_id', targetKey :'id'});
  };
  return referal;
};