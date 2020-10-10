'use strict';
module.exports = (sequelize, DataTypes) => {
  const redeem_voucher = sequelize.define('redeem_voucher', {
    voucher_id: DataTypes.STRING,
    voucher_code: DataTypes.STRING,
    created_at: DataTypes.DATE,
    user_id: DataTypes.STRING,
    email: DataTypes.STRING,
    category: DataTypes.ENUM('UJIAN', 'QUIZ'),
    judul: DataTypes.STRING,
    deskripsi: DataTypes.STRING
  }, {
    timestamps: false
  });
  redeem_voucher.associate = function(models) {
    // associations can be defined here
    redeem_voucher.belongsTo(models.voucher_detail , { as:'voucher' , foreignKey: 'voucher_id', targetKey :'id'});
  };
  return redeem_voucher;
};