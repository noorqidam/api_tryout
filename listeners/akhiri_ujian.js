"use strict"
const Event = require('events');
//const EmailService  = require('../services/EmailServices');
// const AWsMailService = require('../service/AwsEmailService');
// const Mailserver = require('../service/MailServer');
const MailService = require('../service/ujian/SendMailNilai');
const emitter = new Event();

emitter.on('hasilujian', (data)=> {
  console.log('User kirim hasil ujian ' +JSON.stringify(data));
  try {
    MailService.SendMailNilaiSesiUjian(data, data.email);
  } catch (error) {
    console.log(error);
  }
})
emitter.on('hasilujianmandiri', (data)=> {
  console.log('User kirim hasil ujian mandiri ' +JSON.stringify(data));
  try {
    MailService.SendMailNilaiSesiUjianMandiri(data, data.email);
  } catch (error) {
    console.log(error);
  }
})
module.exports = emitter;
