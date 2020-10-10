'use strict';
module.exports = (sequelize, DataTypes) => {
  const customer = sequelize.define('customer', {
    user_id: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.CHAR,
    active : DataTypes.BOOLEAN,
    jenis_kelamin: DataTypes.STRING,
    referal_code : DataTypes.STRING
  }, {});
  customer.associate = function(models) {
    // associations can be defined here
    //customer.belongsTo(models.customer_detail, { as: 'details', foreignKey: 'user_id' ,targetKey:'user_id'}); 
  };
  return customer;
};