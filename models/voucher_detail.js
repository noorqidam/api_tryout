'use strict';
module.exports = (sequelize, DataTypes) => {
  const voucher_detail = sequelize.define('voucher_detail', {
    master_voucher_id: DataTypes.INTEGER,
    voucher_code: DataTypes.STRING,
    session: DataTypes.STRING,
    total_usage: DataTypes.INTEGER,
    expire_at: DataTypes.DATE,
    start_at: DataTypes.DATE,
    voucher_value: DataTypes.INTEGER,
    max_value: DataTypes.DOUBLE,
    min_transaction: DataTypes.DOUBLE,
    category: DataTypes.ENUM('ALL','MODULE','LANGGANAN','UJIAN','QUIZ'),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    deleted: DataTypes.BOOLEAN,
    specific_used: DataTypes.BOOLEAN,
    unique: DataTypes.BOOLEAN,
    sale_price: DataTypes.DOUBLE,
    used: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    nama: DataTypes.STRING,
    hp: DataTypes.STRING,
    nik: DataTypes.STRING,
    nomor_struk: DataTypes.STRING,
    code_toko: DataTypes.STRING,
    bundling_id: DataTypes.INTEGER,
    theme: DataTypes.STRING
  }, {
    // updatedAt: 'updated_at',
    // createdAt: 'created_at'
  });
  voucher_detail.associate = function(models) {
    // associations can be defined here
    voucher_detail.belongsTo(models.mastervoucher , { as:'agen' , foreignKey: 'master_voucher_id', targetKey :'id'});
    voucher_detail.belongsTo(models.agent_sale , { as:'agent_sales' , foreignKey: 'master_voucher_id', targetKey :'id'});
    //voucher_detail.hasMany(models.module_voucher , { as:'module_in' , foreignKey: 'voucher_code', sourceKey :'voucher_code'});
  };
  return voucher_detail;
};