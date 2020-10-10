'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction_sale = sequelize.define('transaction_sale', {
    category: DataTypes.STRING,
    order_id: DataTypes.INTEGER,
    amount: DataTypes.DOUBLE,
    publisher_id: DataTypes.INTEGER,
    information: DataTypes.TEXT,
    price_order : DataTypes.DOUBLE,
    date_cutoff: DataTypes.DATE,
    durasi_langganan : DataTypes.INTEGER,
    total_access : DataTypes.INTEGER,
    email : DataTypes.STRING
  }, {});
  transaction_sale.associate = function(models) {
    // associations can be defined here
    transaction_sale.belongsTo(models.publisher, { as: 'publisher', foreignKey: 'publisher_id' , targetKey:'id'}); 
    transaction_sale.hasMany(models.count_access_paket_soal, { as:'rincian', foreignKey :'order_id' ,sourceKey :'order_id'});
  };
  return transaction_sale;
};