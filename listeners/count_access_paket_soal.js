"use strict"
const Event = require('events');
const emitter = new Event();
const db =  require('../models/index');
const	Sequelize	=	require('sequelize');
const	Op 			  = 	Sequelize.Op;

emitter.on('count', async(data)=> {
  try {
    const GetPublisher = await db.module.findOne({
      attributes:['id','publisher_id'],
      where : {
        id : {
          [Op.eq] : data.module_id
        }
      }
    });

    if (GetPublisher) {

      let dataDump = {
        module_id :data.module_id,
        paket_soal_id:data.paket_soal_id,
        publisher_id:GetPublisher.publisher_id,
        subscription_id :data.subscription_id,
        order_id : data.order_id,
        user_id:data.user_id,
      }

      db.count_access_paket_soal.create(dataDump)
      .then(response => {
        console.log('Count Acces Paket Soal (`Langganan`) => ' +response.id)
      })
      .catch(err => {
        console.log('Count Acces Paket Soal (`Langganan`) => ' + err)
      })
    } else {
      console.log('Module Not Found ')
    }
  } catch (error) {
    console.log(error)
  }
 
})

module.exports = emitter;
