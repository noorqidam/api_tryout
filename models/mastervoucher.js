'use strict';
module.exports = (sequelize, DataTypes) => {
  const mastervoucher = sequelize.define('mastervoucher', {
    agent_name: DataTypes.STRING,
    //referal_fee: DataTypes.DOUBLE,
    //transaction_fee: DataTypes.DOUBLE,
    deleted: DataTypes.BOOLEAN,
    //agent_child: DataTypes.INTEGER
  }, {
    
  });
  mastervoucher.associate = function(models) {
    // associations can be defined here
    mastervoucher.hasMany(models.voucher_detail , { as:'voucher_details' , foreignKey: 'id', targetKey :'master_voucher_id'});
  };
  return mastervoucher;
};