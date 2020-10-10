'use strict';
module.exports = (sequelize, DataTypes) => {
  const r_voucher_sale = sequelize.define('r_voucher_sale', {
    voucher_code: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    email: DataTypes.STRING,
    nama: DataTypes.STRING,
    nik: DataTypes.STRING,
    code_toko: DataTypes.STRING,
    nomor_struk: DataTypes.STRING,
    hp: DataTypes.STRING,
    nama_toko: DataTypes.STRING,
    theme: DataTypes.STRING
  }, {});
  r_voucher_sale.associate = function(models) {
    // associations can be defined here
  };
  return r_voucher_sale;
};