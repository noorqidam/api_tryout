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
 * --level2
 * @param email
 * @param user_id
 * @param referal_code
 *  
 * name :'fee transactions referal ' + data.referal_code,
  id : GetAgentChild.id,
  email : data.email,
  referal_fee : GetAgentChild.referal_fee,
  from_transaction: 'activate '+data.email ? data.email :data.user_id,
  ref_point : agentSales.id,
  code_transaction: 'edu_activate',
 */
emitter.on('activate_user',async(data)=> {
  console.log('Listen User Activate (Child) '+ JSON.stringify(data));
  let point =0;
  let Saldobalance  = await db.agent_child_point.findOne({
    where : {
      id : {
        [Op.eq] : data.id
      }
    }
  });

  if(Saldobalance){
    point += Saldobalance.saldo + data.referal_fee;
    console.log('Penambahan Saldo (child) level 2 agent id = ' + data.id)
    return db.sequelize.transaction(function (t) {
      return db.agent_child_point.update({
        //agent_child_id: data.id,
        saldo :point, //update saldo 
      }, {
        where : {
          agent_child_id:  {
            [Op.eq] : data.id
          }
        }
      }, {transaction: t}).then(function (rowPoint) {
        return db.transaction_agent_child_point.create({
          name : data.name,
          agent_child_id: data.id,
          kredit_point: data.referal_fee,
          from_transaction: 'activate '+data.email ? data.email :data.user_id,
          code_transaction: 'edu_activate',
          ref_point :data.ref_point
        })
      })
    }).then(rows => {
      console.log('Success Add Point To Child Agent '+rows);
    }).catch(err =>{
      console.log('error Add Point User Activate' + err)
    })
  } else {
    console.log('Warning .. Levelv2 ' + data.id +'Does`nt Have Default Balance')
  }
 
})
/**
 * Add Point to User If User Hasbeen Finish Payment Orders
 *  name :'fee transactions Voucher  ' + agentSales.id,
        id : GetAgentChild.id,
        email : data.email,
        transaction_fee : GetAgentChild.transaction_fee,
        from_transaction: 'payment '+data.email ? data.email :data.user_id,
        ref_point : agentSales.id,
        code_transaction: 'edu_payments',
 */
emitter.on('user_payments',async (data)=> {
  console.log('Listener data ' +JSON.stringify(data));
  let point = 0;

  let Saldobalance  = await db.agent_child_point.findOne({
    where : {
      id : {
        [Op.eq] : data.id
      }
    }
  });

  if(Saldobalance){
    let balance_point = Saldobalance.saldo;//
    let CountFeetransaction = (data.transaction_fee * data.total_payment) /100;
     point += balance_point+ CountFeetransaction; 
      console.log('Penambahan Saldo Sale level 2 agent id = ' + data.id +'==' + CountFeetransaction)
      //{{ created transaction }}
      return db.sequelize.transaction(function (t) {
        return db.agent_child_point.update({
          saldo :point, //update saldo 
        },{
          where : {
            id : {
              [Op.eq] : data.id
            } 
          }
        }, {transaction: t}).then(function (rowPoint) {
          return db.transaction_agent_child_point.create({
            name :'fee transactions transaction ' + data.from_transaction,
            agent_child_id: data.id,
            kredit_point: CountFeetransaction,
            from_transaction: 'payment '+data.email,
            ref_point : data.ref_point,
            code_transaction: 'edu_payments' // static code transaction activate_user
          } ,{ transaction : t})
        })
      }).then(rows => {
        console.log('Success Add Point To Agent '+rows);
      }).catch(err =>{
        console.log('error Add Point User Payment' + err);
      })
  } else {
    console.log('Child Does`n have Default Saldo Balance=' +data.id)
  }
});

module.exports = emitter;