"use strict"
const Event = require('events');
const emitter = new Event();
const db =  require('../models/index');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;


/**
 * Add Point to Users
 */
emitter.on('activate_user',async(data)=> {
  let point = 10;
  
  return db.sequelize.transaction(function (t) {
    return db.user_point.create({
      balance_point :point, //user new 
      user_id: data.user_id
    }, {transaction: t}).then(function (rowPoint) {
      return db.transaction_user_point.create({
        user_id: data.user_id,
        kredit_point: point,
        code_transaction: 'edu_activate'
      })
    })
  }).then(rows => {
    console.log('Success Add Point To Users '+rows)
  }).catch(err =>{
    console.log('error Add Point User Activate' + err)
  })
   
 
})
/**
 * Add Point to User If User Hasbeen Finish Payment Orders
 */
emitter.on('user_payments',async (data)=> {
  let point = 10;
  const Userpoint = await db.user_point.findOne({
    where : {
      user_id : {
        [Op.eq] : data.user_id
      }
    }
  });
  if (Userpoint) {
    let balance_point = Userpoint.balance_point += point;
    return db.sequelize.transaction(function (t) {
      return db.user_point.create({
        balance_point :  balance_point, //user new 
        user_id: data.user_id
      }, {transaction: t}).then(function (rowPoint) {
        return db.transaction_user_point.create({
          user_id: data.user_id,
          kredit_point:point,
          code_transaction: 'edu_payment'
        })
      })
    }).then(rows => {
      console.log('Success Add Point To Users '+rows)
    }).catch(err =>{
      console.log('error Add Point User Paymnets' + err)
    })
  } else {
    console.log('Data User Point Not Found')
  }
});

emitter.on('finihs_user_profile', async (data)=> {
  let point = 10;
  const Userpoint = await db.user_point.findOne({
    where : {
      user_id : {
        [Op.eq] : data.user_id
      }
    }
  });
  if (Userpoint) {
    let balance_point = Userpoint.balance_point += point;
    return db.sequelize.transaction(function (t) {
      return db.user_point.create({
        balance_point :  balance_point, //user new 
        user_id: data.user_id
      }, {transaction: t}).then(function (rowPoint) {
        return db.transaction_user_point.create({
          user_id: data.user_id,
          kredit_point:point,
          code_transaction: 'edu_profile'
        })
      })
    }).then(rows => {
      console.log('Success Add Point To Users '+rows)
    }).catch(err =>{
      console.log('error Add Point User Profile' + err)
    })
  } else {
    console.log('Data User Point Not Found')
  }
  
});

emitter.on('finish_test', async (data)=> {
  let point = 10;
  const Userpoint = await db.user_point.findOne({
    where : {
      user_id : {
        [Op.eq] : data.user_id
      }
    }
  });
  if (Userpoint) {
    let balance_point = Userpoint.balance_point += point;
    return db.sequelize.transaction(function (t) {
      return db.user_point.create({
        balance_point :  balance_point, //user new 
        user_id: data.user_id
      }, {transaction: t}).then(function (rowPoint) {
        return db.transaction_user_point.create({
          user_id: data.user_id,
          kredit_point:point,
          code_transaction: 'edu_assesment'
        })
      })
    }).then(rows => {
      console.log('Success Add Point To Users '+rows)
    }).catch(err =>{
      console.log('error Add Point User Assesment Test' + err)
    })
  } else {
    console.log('Data User Point Not Found')
  }
})