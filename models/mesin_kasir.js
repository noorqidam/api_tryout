'use strict';
module.exports = (sequelize, DataTypes) => {
  const mesin_kasir = sequelize.define('mesin_kasir', {
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
    QTY: DataTypes.INTEGER,
    datetime: DataTypes.STRING
  }, {});
  mesin_kasir.associate = function(models) {
    // associations can be defined here
  };
  return mesin_kasir;
};