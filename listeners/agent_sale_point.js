"use strict"
const Event = require('events');
const emitter = new Event();
const db =  require('../models/index');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const AgentChild = require('./agent_child_point');
const AgentMaster = require('./agent_master_point');

/**
 * Add Point to Agent
 * By Referal 
 * -level1
 * --level2
 * ---level3
 * @param email
 * @param user_id
 * @param referal_code
 */

emitter.on('activate_user',async(data)=> {
  console.log('Listen User Activate (Sale) '+ JSON.stringify(data))
  /**
   * Check Referal Code Owner and get Referal Fee & Agent Mush Active
   */
  try {
    let getSalePoint = await db.referal.findOne({
      include :[
        { model : db.agent_sale , as :'agent_sales', attributes :['id','agent_child_id','agent_name','referal_fee'], where : {
          status : {
            [Op.eq] : true
          }
        }}
      ],
      where : {
        referal_code : {
          [Op.eq] : data.referal_code
        }
      }
    });

    if (getSalePoint) {
      let agentSales = getSalePoint.agent_sales;
      let fee = agentSales.referal_fee;
      /** Get Saldo Balance in Agent  */
      let Saldobalance  = await db.agent_sale_point.findOne({
        where : {
          agent_sale_id : {
            [Op.eq] : agentSales.id
          }
        }
      });
      let point =0;
      if (agentSales.agent_child_id) {
        console.log('Checking Agent Level 2')
        // ada child agent { level 2}
        let GetAgentChild = await db.agent_child.findOne({
          include:[{ model : db.agent_master ,as :'master_agent'}],
          where : {
            id : {
              [Op.eq] : agentSales.agent_child_id
            }
          }
        });
        let dataChild = {
          name :'fee transactions referal ' + data.referal_code,
          id : GetAgentChild.id,
          email : data.email,
          referal_fee : GetAgentChild.referal_fee,
          from_transaction: 'activate '+data.email ? data.email :data.user_id,
          ref_point : agentSales.id,
          code_transaction: 'edu_activate',
        }
        let MasterAgent = GetAgentChild.master_agent;
        let dataMaster = {
          name :'fee transactions referal ' + data.referal_code,
          id : MasterAgent.id,
          email : data.email,
          referal_fee : MasterAgent.referal_fee,
          from_transaction: 'activate '+data.email ? data.email :data.user_id,
          ref_point : GetAgentChild.id,
          code_transaction: 'edu_activate'
        }
  
        AgentChild.emit('activate_user', dataChild);
  
        if (GetAgentChild.master_agent) {
          console.log('Checking Agent Level 1')
          AgentMaster.emit('activate_user',dataMaster);
        }
  
        
        
      } else {
        console.log('Agent Sale '+agentSales.agent_name+' is`n Have level 2');
      }
  
      if(Saldobalance){
        /** Sum Point { saldo balance + referal_fee} */
        
        point += Saldobalance.saldo + fee;
        console.log('Penambahan Saldo Sale level 3 agent id = ' + agentSales.id +'==' + point)
        //{{ created transaction }}
        return db.sequelize.transaction(function (t) {
          return db.agent_sale_point.update({
            saldo :point, //update saldo 
          },{
            where : {
              agent_sale_id : {
                [Op.eq] : agentSales.id
              } 
            }
          }, {transaction: t}).then(function (rowPoint) {
            return db.transaction_agent_sale_point.create({
              name :'fee transactions referal ' + data.referal_code,
              agent_sale_id: agentSales.id,
              kredit_point: fee,
              from_transaction: 'activate '+data.email ? data.email :data.user_id,
              code_transaction: 'edu_activate' // static code transaction activate_user
            } , { transaction : t})
          })
        }).then(rows => {
          console.log('Success Add Point To Agent '+rows);
        }).catch(err =>{
          console.log('error Add Point User Activate' + err);
        })
  
      }
    }

  } catch (error) {
    console.log(error)
  }
 

  /** If Data Exist */
  
 
});


/**
 * Add Point to User If User Hasbeen Finish Payment Orders
 * @requires vouchercode
 * @requires orderid
 * @requires userId
 * @requires totalPayments
 */
emitter.on('user_payments',async (data)=> {
  
  console.log('Listen User Payment (Sale) '+ JSON.stringify(data))
  /**Checking User Referal Code */
  let GetReferalCode = await db.customer.findOne({
    where : {
      user_id : {
        [Op.eq] : data.user_id
      }
    }
  });

  /**
   * if users Payment Have referal Code in indentities , post fee transaction to agent sales
   */
  if (GetReferalCode) {
    console.log('User transaction have a ReferalCode => ' + GetReferalCode.referal_code)
    /**
    * Check referal Code Owner and get Fee & Agent Mush Active
    */
    let getSalePoint = await db.referal.findOne({
      include:[ { model : db.agent_sale , as :'agent_sales' , where : {
        status: {
          [Op.eq] : true
        }
      }}],
      where : {
        referal_code: {
          [Op.eq] : GetReferalCode.referal_code
        }
      }
    });

     /** If Data Exist */
    if (getSalePoint) {
      console.log(JSON.stringify(getSalePoint.agent_sales))
      let agentSales = getSalePoint.agent_sales;
      let Percentasefee =  agentSales.transaction_fee;
      let NominalFee = (data.total_payment * Percentasefee) / 100;
      console.log('Hitung Fee '+ Percentasefee +'*' + data.total_payment + ' /100')
      /** Get Saldo Balance in Agent  */
      let Saldobalance  = await db.agent_sale_point.findOne({
        where : {
          agent_sale_id : {
            [Op.eq] : agentSales.id
          }
        }
      });
      let point =0;
      if (agentSales.agent_child_id) {
        console.log('Checking Agent Level 2')
        // ada child agent { level 2}
        let GetAgentChild = await db.agent_child.findOne({
          include:[{ model : db.agent_master ,as :'master_agent'}],
          where : {
            id : {
              [Op.eq] : agentSales.agent_child_id
            }
          }
        });
        
        let dataChild = {
          name :'fee transactions referal  ' + agentSales.id,
          id : GetAgentChild.id,
          email : GetReferalCode.email,
          transaction_fee : GetAgentChild.transaction_fee,
          from_transaction: 'payment '+GetReferalCode ? GetReferalCode.email : GetReferalCode.user_id,
          ref_point : agentSales.id,
          code_transaction: 'edu_payments',
          total_payment : data.total_payment
        }
        let MasterAgent = GetAgentChild.master_agent;
        let dataMaster = {
          name :'fee transactions Referal  ' + agentSales.id,
          id : MasterAgent.id,
          email : data.email,
          transaction_fee : MasterAgent.transaction_fee,
          from_transaction: 'payment '+data.email ? data.email :data.user_id,
          ref_point : GetAgentChild.id,
          code_transaction: 'edu_payments',
          total_payment : data.total_payment
        }

        AgentChild.emit('user_payments', dataChild);

        if (GetAgentChild.master_agent) {
          console.log('Checking Agent Level 1')
          AgentMaster.emit('user_payments',dataMaster);
        }

        
        
      } else {
        console.log('Agent Sale '+agentSales.agent_name+' is`n Have level 2');
      }

      if(Saldobalance){
        /** Sum Point { saldo balance + referal_fee} */
        
        point += Saldobalance.saldo + NominalFee;
        console.log('saldo awal '+agentSales.id +'=' +Saldobalance.saldo)
        console.log('Penambahan Saldo Sale level 3 agent id = ' + agentSales.id +' ==' + point)
        //{{ created transaction }}
        return db.sequelize.transaction(function (t) {
          return db.agent_sale_point.update({
            saldo :point, //update saldo 
          },{
            where : {
              agent_sale_id : {
                [Op.eq] : agentSales.id
              } 
            }
          }, {transaction: t}).then(function (rowPoint) {
            return db.transaction_agent_sale_point.create({
              name :'fee transactions Payment User ' + data.user_id,
              agent_sale_id: agentSales.id,
              kredit_point: NominalFee,
              ref_point : GetReferalCode.referal_code,
              from_transaction: 'payment '+GetReferalCode ? GetReferalCode.email : GetReferalCode.user_id,
              code_transaction: 'edu_payments' // static code transaction activate_user
            } ,{ transaction : t})
          })
        }).then(rows => {
          console.log('Success Add Point To AgentSale '+agentSales.id);
        }).catch(err =>{
          console.log('error Add Point User Payment' + err);
        })

      }
    } else {
      console.log('Search Agent sale and agentSale does`nt have a referalCode => ' +GetReferalCode.referal_code )
    }

  } else {
    console.log('Checking referal user :=> , User Payment not Have Referal')
  }
  

 
});

module.exports = emitter;
