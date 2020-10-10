'use strict';
module.exports = (sequelize, DataTypes) => {
  var voucher = sequelize.define('voucher', {
    voucher_code: DataTypes.STRING,
    voucher_value: DataTypes.DOUBLE,
    agent_name : DataTypes.STRING,
    session : DataTypes.STRING,
    expire_at: DataTypes.DATE,
    session :DataTypes.STRING,
    max_value: DataTypes.DOUBLE,
    min_transaction : DataTypes.DOUBLE
  }, {
    defaultScope: {
      // where: {
      //  status : true
      // },
    },
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  voucher.associate = function(models) {
    // associations can be defined here
    //voucher.belongsTo(models.voucher_detail , { as:'voucher_details' , foreignKey: 'id', targetKey :'master_voucher_id'});
  };
  return voucher;
};