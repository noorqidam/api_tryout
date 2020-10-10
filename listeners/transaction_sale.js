"use strict"
const Event = require('events');
const emitter = new Event();
const db =  require('../models/index');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const moment = require('moment');
const AgentChild = require('./agent_child_point');
const AgentMaster = require('./agent_master_point');

/**
 * Add transaction sale
 * @param publisherid
 * @param user_id
 * @param orderid
 */

emitter.on('module',async(data)=> {
  console.log('Listen sale module '+ JSON.stringify(data));
  try {
    const transaction = await db.transaction_sale.create(data);
  } catch (error) {
    console.log('gagal save transaction  sale '+error)
  }
});

emitter.on('subscription',async(data)=> {
  console.log('Listen sale subscription '+ JSON.stringify(data));
  try {
    let currentDay = data.currentDay;
    const transaction = await db.count_access_paket_soal.findAll({
      attributes :['createdAt','publisher_id','order_id','paket_soal_id','user_id'
        //[Sequelize.fn('count', Sequelize.col('count_access_paket_soal.id')), 'total']
      ],
      //attributes :['createdAt','publisher_id','order_id'],
      include:[
        { model : db.publisher , as :'publishers', attributes :['name']},
        { model : db.order , as:'order',attributes:['total_payment']},
        { model : db.my_subscription , as :'langganan', attributes:['duration']}
      ],
      where : {
        [Op.and]:[
          Sequelize.where(Sequelize.fn('date', Sequelize.col('count_access_paket_soal.createdAt')),{
            [Op.eq] : currentDay
          }),
        ],
      },
      group :['order_id','publisher_id']
    }).then(rows => {
      let order = [];
      //console.log(JSON.stringify(rows))
      rows.forEach(element => {
        
        let n = 0;
        let order_id = element.order_id;
        let publisher_id = element.publisher_id;
        let publishers = element.publishers.name;
        let langganan = element.langganan;
        let find = null;
        for (let index = 0; index < order.length; index++) {
          if (order[index].order_id == order_id && order[index].publisher_id == publisher_id) {
            find = true;
            let total = order[index].total;
            order[index] = { 
              "id": index,
              "order_id" : element.order_id, 
              "name" : publishers,
              "publisher_id": element.publisher_id, 
              "total_payment" : element.order.total_payment,
              "total" : total +1,
              "duration" : langganan.duration,
              "createdAt" : element.createdAt
            };
            
          } 
        }
        if (!find) {
          
          order.push({  
            "id": n,
            "name" :publishers,
            "order_id" : element.order_id,
            "total_payment" : element.order.total_payment,
            "publisher_id": element.publisher_id,
            "total": 1, //total publisher di access per order
            "duration" : element.langganan.duration,
            "createdAt" : element.createdAt
          })  
          
          n++;
        }
      });

      order.forEach(element => {
        console.log(element.createdAt +'-'+element.total + '=> '+element.name +' order id =>' + element.order_id +'=> total acces' + element.total  +'=> P' + element.total_payment)
        hitung(element.publisher_id,1,element.total,element.duration,element.total_payment)
      });
      process.exit()
    })
    
  } catch (error) {
    console.log('gagal save transaction  sale '+error)
  }
});
function hitung(publisher_id,publisher_access,total,durasi_langganan,harga){
  let pendapatan = ((publisher_access /total) *(1 / durasi_langganan )* harga)
  console.log(publisher_id +'=> '+pendapatan.toFixed(3) +' / days'); 
}
module.exports = emitter;
