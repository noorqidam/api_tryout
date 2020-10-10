'use strict';
module.exports = (sequelize, DataTypes) => {
  const agent_master = sequelize.define('agent_master', {
    nama_institusi: DataTypes.STRING,
    pic: DataTypes.STRING,
    hp: DataTypes.CHAR,
    referal_fee: DataTypes.DOUBLE,
    transaction_fee: DataTypes.DOUBLE,
    status : DataTypes.BOOLEAN,
    deleted : DataTypes.BOOLEAN
  }, {
    defaultScope : {
      deleted : false
    }
  });
  agent_master.associate = function(models) {
    // associations can be defined here
  };
  return agent_master;
};