"use strict"
const Event = require('events');
const EmailService  = require('../services/EmailServices');
const emitter = new Event();

emitter.on('assesment.point',(data)=> {
  console.log('User Assesment ' +JSON.stringify(data));
});


module.exports = emitter
