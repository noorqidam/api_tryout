"use strict"
const Event = require('events');
const EmailService  = require('../services/EmailServices');
//const PaymentService  = require('../services/EmailPayments');
const PaymentAwsService = require('../services/AwsPaymentService');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const db            = require('../models/index');
const admin       = require('../config/firebaseAdmin')

const emitter = new Event();

/**
 * Data = {
      order_nomor : req.body.order_nomor,
      tanggal_bayar : new Date(),
      total_payment : GetOrder.total_payment
    }
    @requires order_nomor
    @requires tanggal_bayar
    @requires total_payment
 */

emitter.on('payments',(data)=> {
  console.log('Payments '+JSON.stringify(data));
  db.order.findOne({
    where : {
      id : {
        [Op.eq] : data.order_nomor
      }
    }
  })
    .then(dataMail => {
      admin.auth().getUser(dataMail.user_id)
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully fetched user data:", userRecord.toJSON());
        PaymentAwsService.NotificationPaymentSuccess(data,userRecord.email);
        //(data,userRecord.email,userRecord.displayName);
      })
      .catch(function(error) {
        console.log("Error fetching user data:", error);
      });
    })
})
module.exports = emitter
