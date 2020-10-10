'use strict';
module.exports = (sequelize, DataTypes) => {
  const payments_status = sequelize.define('payments_status', {
    status_code: DataTypes.STRING,
    status_message: DataTypes.STRING,
    categories : DataTypes.STRING,
    transaction_id: DataTypes.STRING,
    order_id: DataTypes.STRING,
    gross_amount: DataTypes.DOUBLE,
    payment_type: DataTypes.STRING,
    transaction_time: DataTypes.DATE,
    transaction_status: DataTypes.STRING,
    fraud_status: DataTypes.STRING,
    bill_key: DataTypes.STRING,
    biller_code: DataTypes.STRING,
    pdf_url: DataTypes.STRING
  }, {});
  payments_status.associate = function(models) {
    // associations can be defined here
    payments_status.belongsTo(models.order, { as: 'orders', foreignKey: 'order_id' ,targetKey:'id'}); 
  };
  return payments_status;
};