"use strict"
const	express  	=	require('express');
const	Sequelize	=	require('sequelize');
const	Op 			  = 	Sequelize.Op;
const	router 		= 	express.Router();
const db        =   require('../../../models/index');
const FirebaseAdmin  = require('../../../config/FirebaseAdmin');
const { check, validationResult } = require('express-validator');

/**
* Create resource
/ @request Body
*/
router.post('/',[
  check('phone').not().isEmpty().withMessage('phone required'),
  //check('phone').isLength({ min: 10 ,max: 13})
], async (req, res)=> {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let phone = req.body.phone;
    try {
      
      let dataFirebase = await  FirebaseAdmin.auth().getUserByPhoneNumber(phone)
        .then(function(userRecord) {
          if (userRecord) {
            return true;
          } else {
            return false
          }
        
        }).catch(error => {
          return false;
          
        })
      if (dataFirebase ) {
        return res.status(200).json({
          success : 'false',
          message :' Phone Telah Terdaftar' ,
          phone: 'Terdaftar',
          
        });
      } else {
    
        const CurrentUSer = await db.customer.findOne({
          attributes:['phone','createdAt'],
          where : {
            phone : {
              [Op.eq] :phone
            }
          }
        });
    
        if (CurrentUSer) {
          console.log('register data ' + JSON.stringify(CurrentUSer));
          return res.status(200).json({
            success : 'false',
            message : phone + ' Telah Terdaftar di Edutore Silahkan Activasi' 
           
          });
        } else {
          return res.status(404).json({
            success : 'true',
            message :'Data Belum terdafatr'
          });
        }
      }
    }  catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
  
});



module.exports	=	router;