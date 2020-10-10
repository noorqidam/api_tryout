"use strict"
const Event = require('events');
const emitter = new Event();
const MailsService = require('../service/register/welcome')
emitter.on('welcome', async (data)=> {
  console.log('Listen process Send Mail Welcome  ' +JSON.stringify(data));
  try {
   
    MailsService.SendMailWelcome(data.name,data.email)
   
  } catch (error) {
    console.log(error);
  }
  
});

module.exports = emitter;
