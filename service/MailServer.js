"use strict"
const path      =  require('path')
const nodemailer = require('nodemailer');
const	Sequelize	=	require('sequelize');
const	Op 			  = 	Sequelize.Op;
const db        = require('../models/index');
const moment    = require('moment');
var mandrillTransport = require('nodemailer-mandrill-transport');

const transporter = nodemailer.createTransport({
  host: "139.255.120.100",
  port: 2525,
  // host: "202.158.93.230",
  // port: 58224,
  secure: false, // upgrade later with STARTTLS
  tls:{
    rejectUnauthorized: false
  }
});


const sender = 'Order Edutore.com <no-reply@edutore.com>';

/**
 * Tempalte Emails render
 */
const templateDir = path.join(__dirname, '../views', 'Email');
const templateVerification = path.join(__dirname, '../views', 'Verification');
const templateOrderDir = path.join(__dirname, '../views', 'Order');
const TagihanNew = path.join(__dirname, '../views', 'tagihan_new');
const NewVerivicationMail = path.join(__dirname, '../views','new_activate_email'); // new templat
const Email = require('email-templates');

module.exports.NotifError = async function(info){
  let mailOptions = {
    from: 'notiferror.com <no-reply@edutore.com>', // sender address
    to: 'rohmat771@gmail.com', // list of receivers
    subject:'Error Send Mail',
    html:  'Error Send mail ' + info,
  }

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log('email gagal ' +JSON.stringify(err))
    else
      console.log('email berhasil ' +JSON.stringify(info));
  });
}
/**
 * Email Verifications Email
 * @request Body
 */
 module.exports.EmailVerifications = async function(email,url){
  if (!email) {
    console.log('email not found');
    return false; //return false if emailUser not Found
  }

  try {
    
    const RenderEmail = new Email();
    RenderEmail
      .render(NewVerivicationMail, {
        email: email,
        url: url
      })
      .then(result => {
        let mailOptions = {
          from: 'RegisterEdutore.com <no-reply@edutore.com>', // sender address
          to: email, // list of receivers
          subject:'Terima kasih Mendaftar di Edutore by Gramedia Segera Aktivasi Email Anda',
          html:  result,
        }

        transporter.sendMail(mailOptions, function (err, info) {
          if(err)
            console.log('email gagal ' +JSON.stringify(err))
          else
            console.log('email berhasil ' +JSON.stringify(info));
        });

        return true;
      })
      .catch( err => {
        console.log(err);
        return false;
      });
   

  } catch (error) {

    console.log(error);
    return false;
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
}

/**
 * Email Welcome Edutore
 */
module.exports.EmailWelcome = async function(emailUser,name){
  

  if (!emailUser) {
    return false; //return false if emailUser not Found
  }

  try {
    
    const RenderEmail = new Email();
    RenderEmail
      .render(templateDir, {
        name: name ? name : emailUser,
        email : emailUser
      })
      .then(result => {
        
        let mailOptions = {
          from: 'Edutore.com <no-reply@edutore.com>', // sender address
          to: emailUser, // list of receivers
          subject: 'Terima kasih sudah bergabung di Edutore by Gramedia', // Subject line
          html:  result,
          text:'Terima kasih sudah bergabung di Edutore by Gramedia'
        }
        transporter.sendMail(mailOptions, function (err, info) {
          if(err)
            console.log('email gagal ' +JSON.stringify(err))
          else
            console.log('email berhasil ' +JSON.stringify(info));
        });

        return true;

      })
      .catch( err => {
        return false;
      });
   

  } catch (error) {

    console.log(error);
    return false;
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
 }
/**
 * Email Order Notifications
 */
module.exports.EmailOrderNotification = async function(order,emailUser,username){
  
  if (!emailUser) {
    return false; //return false if emailUser not Found
  }

  try {
    const Dataorder = await db.order.findOne({
      include :[ {model : db.detail_order ,as :'order_details',
        include :[ { model : db.module , as :'module', attributes:['id','name','module_slug','image','publisher_id','description','price'],
          include :[ {model : db.publisher ,as :'publisher' , attributes :['id','name']} ]
        }]
      } ],
      where : {
        order_nomor : {
          [Op.eq] :order
        }
      },
      distrinct : true
    });
    moment.locale('id');
    let tgl = Dataorder.createdAt ? Dataorder.createdAt : '';
    let tanggal = moment(tgl).format('DD MMMM YYYY, hh:mm:ss ');
    let details = Dataorder.order_details; 
    let detailsData = Dataorder.order_details;
    // res.render('Order', { name: 'Rohmat mret', order: order ,tanggal :tanggal ,details : details})
    let Images = [];  
    detailsData.forEach(element => {
      //console.log(element.module)
      Images.push({
        filename: element.module.image,
        path: 'https://storage.googleapis.com/edutore-cdn/public/module/thumb/'+element.module.image,
        cid: element.module.id
      });
    });
    const RenderEmail = new Email();
    RenderEmail
      .render(templateOrderDir, {
        name: username ? username : emailUser,
        order : Dataorder,
        tanggal :tanggal,
        details : details
      })
      .then(result => {
        
        let mailOptions = {
          from: 'Order Edutore.com <no-reply@edutore.com>', // sender address
          to: emailUser, // list of receivers
          subject: 'Terima kasih Telah Berbelanja di Edutore by Gramedia', // Subject line
          html:  result,
          attachments: [Images]
        }

        transporter.sendMail(mailOptions, function (err, info) {
          if(err)
            console.log('email gagal ' +JSON.stringify(err))
          else
            console.log('email berhasil ' +JSON.stringify(info));
        });

        return true;

      })
      .catch( err => {
        return false;
      });
   

  } catch (error) {

    console.log(error);
    return false;
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
}

/**
 *  { name: 'rohmat', order_nomor: 'FM1232176e!' ,tanggal_beli : new Date(), total_payment: 12000 ,batas_pembayaran:new Date()})
 */
module.exports.EmailTagihan = async function(data){
  
  if (!data.email) {
    return false; //return false if emailUser not Found
    /**
     *  order : orderKey,
        email : email,
        name : User.name ? User.name : User.displayName,
        total_payment : Granttotal,
        tanggal_pembelian : new Date(),
        batas_pembayaran :moment().add(1, 'days').format('YYYY-MM-DD hh:mm:ss'),
     */
  }

  try {
    console.log('email tagihan ' +data);
    let max_bayar = new Date();
    max_bayar.setDate(max_bayar.getDate() + 1);
    const RenderEmail = new Email();
    RenderEmail
      .render(TagihanNew, {
        name: data.username ? data.username : data.emailUser,
        order_nomor : data.order,
        total_payment : formatPrice(data.total_payment),
        email : data.email,
        tanggal_beli :  new Date(),
        batas_pembayaran : max_bayar
      })
      .then(result => {
        console.log(result)
        let mailOptions = {
          from: 'Order Edutore.com <no-reply@edutore.com>', // sender address
          to: data.email, // list of receivers
          subject: 'Terima kasih Telah Berbelanja di Edutore by Gramedia Mohon Selesaikan Pembayaran Anda', // Subject line
          html:  result,
        }

        transporter.sendMail(mailOptions, function (err, info) {
          if(err)
            console.log('email gagal ' +JSON.stringify(err))
          else
            console.log('email berhasil ' +JSON.stringify(info));
        });

        return true;

      })
      .catch( err => {
        console.log(err)
        return false;
      });
   

  } catch (error) {

    console.log(error);
    return false;
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
}

function formatPrice(value) {
  let val = (value/1).toFixed(0).replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}