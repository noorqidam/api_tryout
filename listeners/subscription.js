"use strict"
const Event = require('events');
const emitter = new Event();
const db =  require('../models/index');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const randomstring = require('randomstring');
const moment = require('moment');


/**
 * Add to Users 
 * Menambahkan ke My Subscription User 
 * Jika Menggunakan Referal Code Pada Saat Mendaftar Yang dimana Referal Agent Memmpunyai Paket Langgananan.
 */
emitter.on('free_subscription',async (data)=> {
  console.log(JSON.stringify(data));
  try {
    //Get Package Subscription In referal Code
    const Subscription = await  db.package_subsciption.findOne({
      where : {
        referal_code : {
          [Op.eq] : data.referal_code
        }
      }
    });

    if (Subscription) {
      let UniqueNumber = randomstring.generate({
        length : 5,
        charset:'numeric'
      });
      let getDurasi = parseInt(Subscription.duration); //satuan bulan
      let getBonus = parseInt(Subscription.bonus_duration); //satuan hari
      //let TotalDurasi = getDurasi + getBonus;
      
      let Date_now = moment();
      let Durasi =moment(Date_now).add(getDurasi,'days'); // durasi di ubah ke harian
      let TotalDurasi =moment(Durasi).add(getBonus,'days'); //durasi akhir
      let CountDurasi = getDurasi + getBonus
      let order_nomor = 'LR'+ UniqueNumber; //LR => Langganan Referal
      console.log('YEY ada Free Subscriptions to '+'-' +data.user_id+'-' + JSON.stringify(Subscription));
      let info;
      return db.sequelize.transaction(function (t) {
        return db.order.create({
          order_nomor : order_nomor,
          user_id: data.user_id,
          email : data.email,
          expire_at : moment().add(1,'days'),
          total_price : 0,
          total_payment: 0,
          payment_status: true,
          payment_method :'REFERAL',
          categories :'LANGGANAN',
        },{ transaction : t}).then ((row)=> {
          info =row;
          return db.detail_langganan.create({
            order_id : row.id,
            package_subscription_id : Subscription.id,
            package_name: Subscription.package_name,
            user_id : data.user_id
          },{ transaction : t}).then(l=> {
            return db.my_subscription.create({
              user_id : data.user_id,
              order_subscription_id : info.id,
              package_subscription_id: Subscription.id,
              buy_at: new Date(),
              expire_at: TotalDurasi,
              duration: CountDurasi
            },{ transaction : t}).then(r => {
              return db.r_langganan_sale.create({
                order_id: info.id,
                order_nomor: order_nomor,
                total_price: 0,
                total_payment: 0,
                user_id: data.user_id,
                email: data.email,
                payment_method: 'REFERAL',
                package_subscription_id: Subscription.id,
                package_name: Subscription.package_name,
                payment_date: new Date(),
                payment_type: 'REFERAL'
              },{ transaction: t})
            
            })
          })
        })
      }).then(function (result) {
        console.log('Success Stored Subscriptions ' + JSON.stringify(result));
      })

    } else {
      console.log('tidak ada langganan dengan referal '+ JSON.stringify(data))
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = emitter