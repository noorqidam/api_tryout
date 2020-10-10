"use strict"
const path      =  require('path')
const	Sequelize	=	require('sequelize');
const	Op 			  = 	Sequelize.Op;
const db        = require('../models/index');
const moment    = require('moment')
const MailServerLocal = require('./MailServer')

const aws  = require('aws-sdk');
aws.config.loadFromPath(__dirname +'/awsConfig.json');
const sender = 'Edutore <register@edutore.com>'; // sender address
//const ses = new aws.SES(); // "region": "us-east-1"
const ses = new aws.SES({region: 'us-east-1'});
/**
 * Template Emails Render
 */
const templateDir = path.join(__dirname, '../views', 'Email'); //email welcome ( active user)
const NewVerivicationMail = path.join(__dirname, '../views','new_activate_email'); //new template
const templateOrderDir = path.join(__dirname, '../views', 'Order');
const TagihanNew = path.join(__dirname, '../views', 'tagihan_new');

const Email = require('email-templates');
const charset = "UTF-8";

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

        let params = { 
          Source: sender,
          Destination: { 
            ToAddresses: [
              email 
            ],
          },
          Message: {
            Subject: {
              Data: 'Terima kasih Mendaftar di Edutore by Gramedia Segera Aktivasi Email Anda', // Subject line,
              Charset: charset
            },
            Body: {
              Html: {
                Data: result,
                Charset: charset
              }
            }
          },
          //ConfigurationSetName: configuration_set
        };
        //Try to send the email.
        ses.sendEmail(params, function(err, data) {
          // If something goes wrong, print an error message.
          if(err) {
            console.log(err.message);
            MailServerLocal.NotifError(err.message)
            
            return false;
          } else {
            console.log("Email sent! Message ID: ", data.MessageId);
            return true;
          }
        });

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
        let params = { 
          Source: 'Edutore <no-reply@edutore.com>', 
          Destination: { 
            ToAddresses: [
              emailUser 
            ],
          },
          Message: {
            Subject: {
              Data: 'Terima kasih sudah bergabung di Edutore by Gramedia',
              Charset: charset
            },
            Body: {
              Html: {
                Data: result,
                Charset: charset
              }
            }
          },
          //ConfigurationSetName: configuration_set
        };
        //Try to send the email.
        ses.sendEmail(params, function(err, data) {
          // If something goes wrong, print an error message.
          if(err) {
            console.log(err.message);
            MailServerLocal.NotifError(err.message)
            return false;
          } else {
            console.log("Email sent! Message ID: ", data.MessageId);
            return true;
          }
        });

      })
      .catch( err => {
        return false;
      });
   

  } catch (error) {
    console.log(error);
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
        let params = { 
          Source: 'Edutore <no-reply@edutore.com>', 
          Destination: { 
            ToAddresses: [
              emailUser 
            ],
          },
          Message: {
            Subject: {
              Data: 'Terima kasih Telah Berbelanja di Edutore by Gramedia',
              Charset: charset
            },
            Body: {
              Html: {
                Data: result,
                Charset: charset
              }
            }
          },
          //ConfigurationSetName: configuration_set
        };
        //Try to send the email.
        ses.sendEmail(params, function(err, data) {
          // If something goes wrong, print an error message.
          if(err) {
            console.log(err.message);
            MailServerLocal.NotifError(err.message)
            return false;
          } else {
            console.log("Email sent! Message ID: ", data.MessageId);
            return true;
          }
        });

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
    return false; 
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
        let params = { 
          Source: 'Edutore <no-reply@edutore.com>', 
          Destination: { 
            ToAddresses: [
              data.email 
            ],
          },
          Message: {
            Subject: {
              Data: 'Terima kasih Telah Berbelanja di Edutore by Gramedia Mohon Selesaikan Pembayaran Anda',
              Charset: charset
            },
            Body: {
              Html: {
                Data: result,
                Charset: charset
              }
            }
          },
          //ConfigurationSetName: configuration_set
        };
        //Try to send the email.
        ses.sendEmail(params, function(err, data) {
          // If something goes wrong, print an error message.
          if(err) {
            console.log(err.message);
            return false;
          } else {
            console.log("Email sent! Message ID: ", data.MessageId);
            return true;
          }
        });
      })
      .catch( err => {
        console.log(err)
        return false;
      });
   

  } catch (error) {

    console.log(error);
  }
}

function formatPrice(value) {
  let val = (value/1).toFixed(0).replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}