"use strict"
const Event = require('events');
const db        =   require('../models/index');
const { Profile } = require('../models/mongoose/profile')
const AWsMailService = require('../service/AwsEmailService');
const Mailserver = require('../service/MailServer');
const emitter = new Event();

emitter.on('create', async (data)=> {
  console.log('Listen process Create User  ' +JSON.stringify(data));
  try {
    const Register =  await db.customer.create(data).then(async response => {
      const SaveProfile = new Profile({
        user_id: data.user_id,
        jenis_kelamin: data.jenis_kelamin
      })
      let SaveDataProfile =  await SaveProfile.save()
      //console.log('Success add User '+ Register +' = ' + SaveDataProfile)
    })
  } catch (error) {
    console.log(error);
  }
  
});

module.exports = emitter;
