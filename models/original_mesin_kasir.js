'use strict';
module.exports = (sequelize, DataTypes) => {
  const original_mesin_kasir = sequelize.define('original_mesin_kasir', {
    TRANSACTIONID: DataTypes.STRING,
    RECEIPTID: DataTypes.STRING,
    TRANSDATE: DataTypes.STRING,
    STORE: DataTypes.STRING,
    TERMINALID: DataTypes.STRING,
    STAFFID: DataTypes.STRING,
    ITEMID: DataTypes.STRING,
    INFOCODEID: DataTypes.STRING,
    INFORMATION: DataTypes.STRING,
    transtime: DataTypes.STRING,
    QTY: DataTypes.STRING
  }, {});
  original_mesin_kasir.associate = function(models) {
    // associations can be defined here
  };
  return original_mesin_kasir;
};