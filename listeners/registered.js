"use strict"
const Event = require('events');
//const EmailService  = require('../services/EmailServices');
const AWsMailService = require('../service/AwsEmailService');
const Mailserver = require('../service/MailServer');
const emitter = new Event();

emitter.on('register',(data)=> {
  console.log('User Register ' +JSON.stringify(data));
  try {
    AWsMailService.EmailVerifications(data.email,data.url);  
  } catch (error) {
    console.log(error);
    Mailserver.EmailVerifications(data.email,data.url);  
  }
  
});

emitter.on('active',(data)=> {
  console.log('User Activate ' +JSON.stringify(data));
  try {
    AWsMailService.EmailWelcome(data.email,data.displayName);  
  } catch (error) {
    console.log(error)
  }
})

module.exports = emitter;
