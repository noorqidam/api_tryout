"use strict"
const Event = require('events');
//const AwsEmailService  = require('../services/EmailServices');
const AwsEmailService = require('../services/AwsEmailService');
const Mailserver  = require('../services/MailServer');
const OrderService  = require('../services/OrderService');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const db            = require('../models/index');
const admin       = require('../config/firebaseAdmin')

const emitter = new Event();
//const io    = require('socket.io');

emitter.on('order.create',(data)=> {
  console.log('User Order ' +JSON.stringify(data));
  try {
    AwsEmailService.EmailTagihan(data);
    //
  } catch (error) {
    Mailserver.EmailTagihan(data);
    console.log(error)
  }
});


emitter.on('order.payments',(data)=> {
  console.log('User Order ' +JSON.stringify(data));
  try {
    //const dataMail  = await debug
    
    db.order.findOne({
      where : {
        order_nomor : {
          [Op.eq] : data
        }
      }
    })
      .then(dataMail => {
        admin.auth().getUser(dataMail.user_id)
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          //console.log("Successfully fetched user data:", userRecord.toJSON());
          
          AwsEmailService.EmailOrderNotification(data,userRecord.email,userRecord.displayName);
        })
        .catch(function(error) {
          Mailserver.EmailOrderNotification(data,data.email,data.email);
          console.log("Error fetching user data:", error);
        });
      })
    
    
  } catch (error) {
    console.log(error)
  }
});


emitter.on('order.midtrans',(data)=> {
  try {
    OrderService.AddURlMidtrans(data.order,data.redirect_url);
  } catch (error) {
    console.log(error) 
  }
})

emitter.on('order_toko',(data)=> {
  console.log('User Order Payment By Toko' +JSON.stringify(data));
  try {
    //module.exports.EmailTagihan = async function(order,emailUser,username,total_payment,tanggal_beli,batas_pembayaran){
      /**
       * order : orderKey,
        email : email,
        name : User.name ? User.name : User.displayName,
        total_payment : Granttotal,
        tanggal_pembelian : new Date(),
        batas_pembayaran :moment().add(1, 'days').format('YYYY-MM-DD hh:mm:ss'),
       */
    //Mailserver.EmailTagihan(data);
    AwsEmailService.EmailTagihan(data);
  } catch (error) {
    console.log(error)
  }
});

//emitter.emit('order_subscription',dataMails);
emitter.on('order_subscription',(data)=> {
  console.log('User Order Langganan' +JSON.stringify(data));
  /**
   * {"order":"L217054","email":"rohmat771@gmail.com","name":"rohmatmret","package_subscription_id":2,"total_payment":40000}
   */
  try {
    AwsEmailService.EmailTagihan(data);
  } catch (error) {
    console.log(error)
  }
})

emitter.on('order_subscription_payments',(data)=> {
  try {
    
  } catch (error) {
    console.log(error)
  }
})
module.exports = emitter
