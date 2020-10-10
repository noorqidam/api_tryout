"use strict"
const Event = require('events');
const emitter = new Event();
const emitterOrder = require('../listeners/order');
const db =  require('../models/index');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const moment  = require('moment');
const AgentSaleListener = require('./agent_sale_point');


emitter.on('langganan',(data)=> {
  
  try {
    db.order.findOne({
      include :[ 
         { model : db.detail_langganan , as :'langganan', include : [
           { model : db.package_subsciption , as :'paket'} 
         ]}
       ],
      where : {
        order_nomor : {
          [Op.eq]: data.order_id
        },
      }
    }).then(GetOrder => {
      if (GetOrder) {
        let d = GetOrder;
        let nama_paket = GetOrder.langganan;
        let getDurasi = parseInt(GetOrder.langganan.paket.duration); //satuan bulan
        let getBonus = parseInt(GetOrder.langganan.paket.bonus_duration); //satuan hari
        
        let Date_now = moment();
        let Durasi =moment(Date_now).add(getDurasi,'days'); // di ubah ke harian
        let TotalDurasi = moment(Durasi).add(getBonus,'days');
        let count_durasi = getDurasi + getBonus;
        let dataSubscription = {
          order_id: GetOrder.id,
          order_nomor: GetOrder.order_nomor,
          voucher: GetOrder.voucher,
          voucher_code: GetOrder.code_voucher,
          total_price: GetOrder.total_price,
          total_payment: GetOrder.total_payment,
          payment_type: "VOUCHER",
          payment_method: GetOrder.payment_method,
          email: GetOrder.email,
          package_name: nama_paket.package_name,
          order_subscription_id : GetOrder.id,
          package_subscription_id: GetOrder.langganan.package_subscription_id,
          user_id: GetOrder.user_id,
          buy_at: new Date(),
          payment_date: new Date(),
          expire_at: TotalDurasi,
          duration : count_durasi
        }
        return db.sequelize.transaction(function (t) {
          return db.my_subscription.create(dataSubscription,{ transaction : t }).then(my => {
            return db.r_langganan_sale.create(dataSubscription, { transaction:t}).then(r => {
              return db.order.update({
                payment_status: true,
              },{
                where : {
                  id : {
                    [Op.eq] : GetOrder.id
                  }
                }
              },{ transaction : t})
            })
          })
        }).then(response => {
          /**
           * @requires order_id
           * @requires order_nomor
           * @requires code_voucher
           * @requires total_payment
           * 
           * let dataInfo = {
              order_id : 152055,
              order_nomor :'MyYCHp4',
              code_voucher :'ekstra',
              user_id :'qDP4s4vZRzdrsOkpNxtyRDATZyz1',
              total_payment : 20000
            }
          */
          
          
          let EmailData = {
            order_id : GetOrder.id,
            order_nomor :  GetOrder.id,
            user_id : GetOrder.user_id,
            tanggal_bayar : new Date(),
            total_payment : GetOrder.total_payment
          }

          //send mails thanks for payments
          //emitterPayment.emit('payments',EmailData);
          //transaction_status
          AgentSaleListener.emit('user_payments',EmailData);
        }).catch(error => {
          console.log(error)
          
        })
      } else {
        console.log('Order Not Found Midtrans')
      }
    })
    
    
  } catch (error) {
    console.log(error)
  }
  
});

emitter.on('module',(data)=> {
  console.log('Midtrans Notif ' +JSON.stringify(data));
  
  const GetOrder =  db.order.findOne({
    include :[ { model : db.detail_order , as :'order_details'}],
    where : {
      order_nomor : {
        [Op.eq]: data.order_id
      },
    }
  }).then(GetOrder => {
    if (GetOrder) {
      console.log('Find Order' +GetOrder)
      try {
  
        let ModulesBuy = [];
  
        GetOrder.order_details.forEach(element => {
          ModulesBuy.push({
            order_id: GetOrder.id,
            module_id : element.module_id,
            module_name: element.module_name,
            user_id : GetOrder.user_id,
            email:GetOrder.email,
            price: element.price,
            discountItem: element.discountItem,
            total_price: element.total_price,
            voucher: GetOrder.voucher,
            voucher_code : GetOrder.code_voucher,
            categories: GetOrder.categories,
            payment_method: GetOrder.payment_method,
            payment_type: "VOUCHER",
            payment_date: new Date(),
            total_payment: element.total_price,
            buy_at : new Date(),
          })
        });
       
        return db.sequelize.transaction(function (t) {
          return db.my_module.bulkCreate(ModulesBuy,{ transaction : t }).then(my => {
            return db.r_module_sale.bulkCreate(ModulesBuy,{ transaction: t}).then(m => {
              return db.order.update({
                payment_status: true,
              },{
                where : {
                  id : {
                    [Op.eq] : GetOrder.id
                  }
                }
              },{ transaction : t})
            })
          })
          // return db.payments_status.create(dataM,{ transaction : t}).then(r => {
            
          // })
        }).then(response => {
          emitterOrder.emit('order.payments',GetOrder.order_nomor); // for send mails
          AgentSaleListener.emit('user_payments',GetOrder);
          // if (data.transaction_status =='settlement') {
            
          // }
          
        }).catch(error => {
          console.log(error)
         
        })
      } catch (error) {
        console.log(error)
       
      }
    } else {
     console.log('order not Found Midtrans ')
    }
    
  }).catch(err => {
    console.log(err)
  })
})

emitter.on('midtrans_expire', (data)=> {
  console.log(JSON.stringify('Order Expire ' + data))
  if (data.categories =='MODULE') {
    try {
      db.order.update({
        deleted : true
      }, {
        where : {
          id : {
            [Op.eq] :data.order_id
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      db.order.update({
        deleted : true
      }, {
        where : {
          order_nomor : {
            [Op.eq] :data.order_id
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  }
 
})

emitter.on('cancel',async (data)=> {
  console.log('Pembayaran cancel ' + JSON.stringify(data))
  const GetOrder = await db.order.findOne({
    where : {
      order_nomor : {
        [Op.eq]: data.order_id
      },
      payment_status :{
        [Op.eq] : true
      }
    }
  }).then(GetOrder => {
    if (GetOrder) {
      console.log('ada order '+JSON.stringify(GetOrder))
      if (GetOrder.categories =='MODULE') {
        return db.sequelize.transaction(function (t) {
          return db.order.update({ payment_status : false } ,{ where : { id :{ [Op.eq] : GetOrder.id}}},{ transaction : t}).then(r => {
            return db.my_module.destroy({
              where : {
                order_id : {
                  [Op.eq] : GetOrder.id
                } 
              }
            },{ transaction : t })
            
          })
        }).then(response => {
          console.log(response)
        }).catch(error => {
          console.log(error)
         
        })
      } else if (GetOrder.categories =='LANGGANAN') {
        return db.sequelize.transaction(function (t) {
          return db.order.update({ payment_status : false},{ where : { id :{ [Op.eq] : GetOrder.id}}},{ transaction : t}).then(r => {
            return db.my_module.destroy({
              where : {
                order_subscription_id : {
                  [Op.eq] : GetOrder.id
                } 
              }
            },{ transaction : t })
            
          })
        }).then(response => {
          console.log(response)
        }).catch(error => {
          console.log(error)
         
        })
      }
     
    }
  }).catch(err => {
    console.log(err)
  })

  
  
})
module.exports = emitter
