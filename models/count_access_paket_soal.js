'use strict';
module.exports = (sequelize, DataTypes) => {
  const count_access_paket_soal = sequelize.define('count_access_paket_soal', {
    module_id: DataTypes.INTEGER,
    publisher_id: DataTypes.INTEGER,
    paket_soal_id: DataTypes.INTEGER,
    user_id: DataTypes.STRING,
    subscription_id: DataTypes.INTEGER,
    order_id: DataTypes.STRING,
    email : DataTypes.STRING,
    deleted : DataTypes.BOOLEAN
  }, {});
  count_access_paket_soal.associate = function(models) {
    // associations can be defined here
    // count_access_paket_soal.belongsTo(models.module, { as: 'modules', foreignKey: 'module_id' , targetKey:'id'});
    // count_access_paket_soal.belongsTo(models.order, { as: 'order', foreignKey: 'order_id' , targetKey:'id'});
    // count_access_paket_soal.belongsTo(models.paket_soal, { as: 'pakets', foreignKey: 'paket_soal_id' , targetKey:'id'});
    // count_access_paket_soal.belongsTo(models.customer, { as: 'user', foreignKey: 'user_id' , targetKey:'user_id'});
    // count_access_paket_soal.belongsTo(models.package_subsciption, { as: 'package', foreignKey: 'subscription_id' , targetKey:'id'}); 
    // count_access_paket_soal.belongsTo(models.publisher, { as: 'publishers', foreignKey: 'publisher_id' , targetKey:'id'});
    // count_access_paket_soal.belongsTo(models.my_subscription, { as: 'langganan', foreignKey: 'subscription_id' , targetKey:'id'});
  };
  return count_access_paket_soal;
};