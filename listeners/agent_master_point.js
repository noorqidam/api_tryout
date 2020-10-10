"use strict"
const Event = require('events');
const emitter = new Event();
const db =  require('../models/index');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;


/**
 * Add Point to Agent
 * By Referal 
 * -level1
 * @param email
 * @param user_id
 * @param referal_code
 *  id : MasterAgent ? MasterAgent.id : MasterAgent.id,
    email : data.email,
    referal_fee : MasterAgent.referal_fee,
    from_transaction: 'activate '+data.email ? data.email :data.user_id,
    ref_point : GetAgentChild.id,
    code_transaction: 'edu_activate'
 */
emitter.on('activate_user',async(data)=> {
  console.log('Listen User Activate (Master) '+ JSON.stringify(data))
  let point =0;
  let Saldobalance  = await db.agent_master_point.findOne({
    where : {
      agent_master_id : {
        [Op.eq] : data.id
      }
    }
  });

  if(Saldobalance){
    point += Saldobalance.saldo + data.referal_fee;
    console.log('Penambahan Saldo (master) level 2 agent id = ' + data.id)
    return db.sequelize.transaction(function (t) {
      return db.agent_master_point.update({
        saldo :point, //update saldo 
      }, {
        where : {
          agent_master_id:  {
            [Op.eq] : data.id
          }
        }
      }, {transaction: t}).then(function (rowPoint) {
        return db.transaction_agent_master_point.create({
          name : data.name,
          agent_master_id: data.id,
          kredit_point: data.referal_fee,
          from_transaction: 'activate '+data.email ? data.email :data.user_id,
          code_transaction: 'edu_activate',
          ref_point :data.ref_point
        })
      })
    }).then(rows => {
      console.log('Success Add Point To master Agent '+rows);
    }).catch(err =>{
      console.log('error Add Point To master Agent ' + err)
    })
  } else {
    console.log('Warning .. Level 1 ' + data.id +'Does`nt Have Default Balance')
  }
 
})
/**
 * Add Point to User If User Hasbeen Finish Payment Orders
 */
emitter.on('user_payments',async (data)=> {
  console.log('Listener data User Payments ' +JSON.stringify(data));
  let point = 0;

  let Saldobalance  = await db.agent_master_point.findOne({
    where : {
      agent_master_id : {
        [Op.eq] : data.id
      }
    }
  });

  if(Saldobalance){
    let balance_point = Saldobalance.saldo;//
    let CountFeetransaction = (data.transaction_fee * data.total_payment) /100;
    console.log('Hitung Fee '+ data.transaction_fee +'*' + data.total_payment + ' /100')
     point += balance_point+CountFeetransaction; 
      console.log('Penambahan Saldo Sale level 1 agent id = ' + data.id +'=' + point);
      //{{ created transaction }}
      return db.sequelize.transaction(function (t) {
        return db.agent_master_point.update({
          saldo :point, //update saldo 
        },{
          where : {
            id : {
              [Op.eq] : data.id
            } 
          }
        }, {transaction: t}).then(function (rowPoint) {
          return db.transaction_agent_master_point.create({
            name :data.name,
            agent_master_id: data.id,
            kredit_point: CountFeetransaction,
            ref_point : data.ref_point,
            from_transaction: 'payment '+data.email ? data.email :data.user_id,
            code_transaction: 'edu_payments' // static code transaction activate_user
          } ,{ transaction : t})
        })
      }).then(rows => {
        console.log('Success Add Point To Agent Master '+ data);
      }).catch(err =>{
        console.log('error Add Point User Payment' + err);
      })
  } else {
    console.log('Warning .. Level 1 ' + data.id +'Does`nt Have Default Balance')
  }
});

module.exports = emitter;