"use strict"
const Event = require('events');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const db            = require('../models/index');


const emitter = new Event();
//const io    = require('socket.io');

emitter.on('unique',async (data)=> {
  console.log('voucher Unique used ' +JSON.stringify(data));
  try {
    const updatedVoucher  = await db.voucher_detail.update({
      used: true
    }, {
      where : {
        voucher_code : {
          [Op.eq] : data.voucher_code
        }
      }
    });
    console.log(updatedVoucher)
  } catch (error) {
    console.log(error)
  }
});

module.exports = emitter
