"use strict"
const	express  	=	require('express');
const	router 		= 	express.Router();
const emitter = require('../../../listeners/user');
const ReferalEmmiter = require('../../../listeners/subscription')
const RegisterEmiiter = require('../../../listeners/welcome')
var SimpleCrypto = require("simple-crypto-js").default;
const FirebaseAdmin  = require('../../../config/FirebaseAdmin');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose')
/**
* Create resource
/ @request Body
*/
router.post('/',[
  check('email').not().isEmpty().isEmail(),
  check('password').not().isEmpty().isLength({ min : 8}),
  check('username').not().isEmpty(),
  check('phone').not().isEmpty().isLength({ min: 10 , max:15}).withMessage('Minimal 10 dan max 15')
], async (req, res)=> {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let address = req.body.address;
    let name    = req.body.username;
    let gender = req.body.gender
    let user_id = mongoose.Types.ObjectId().toHexString()
    
    let urlActivation = 'https://edutore.com/activate/'+ user_id;
    let school = req.body.school ? req.body.school : null
    let valid_link = req.body.valid_link
    console.log('register User => ' + JSON.stringify(req.body))
    const _secretKey = "rohmatmret";
  
    const simpleCrypto = new SimpleCrypto(_secretKey)
    const passwordencryp = simpleCrypto.encrypt(password)
    
    try {

      let dataCustomers = {
        email     : email,
        name      : name,
        user_id   : user_id,
        password  : passwordencryp,
        active    : true,
        phone     : phone,
        jenis_kelamin    : gender,
        referal_code : req.body.referal_code,
        url_activation : urlActivation 
      }
      let GetPhoneInFirebase = await FirebaseAdmin.auth().getUserByPhoneNumber(phone)
        .then(function(userRecord) {
          console.log("Successfully fetched user data:", userRecord.toJSON());
          if (userRecord) {
            return true;
          } else {
            return false
            
          }
        })
        .catch(function(error) {
          //return;
          return false;
        });

      let GetUserMailFirebase = await  FirebaseAdmin.auth().getUserByEmail(email)
        .then(function(userRecord) {

          // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully fetched user data:", userRecord.toJSON());
          if (userRecord) {
            return true;
          } else {
            return false
          }
        
        }).catch(error => {
          return false;
          
        })
      if (GetUserMailFirebase ) {
        return res.status(409).json({
          success : 'false',
          message :email  +' or phone ' +phone + ' Telah Terdaftar' ,
          email: 'Terdaftar',
          phone : GetPhoneInFirebase ? 'Terdaftar' : 'Belum Terdaftar'
          
        });
      } else if(GetPhoneInFirebase){
        return res.status(409).json({
          success : 'false',
          message :email  +' or phone ' +phone + ' Telah Terdaftar' ,
          email: GetUserMailFirebase ? 'Terdaftar' :'Belum Terdaftar',
          phone : 'Terdaftar' 
        });
      }else {
        FirebaseAdmin.auth().createUser({
          uid : user_id,
          email: email,
          emailVerified: true,
          phoneNumber: phone,
          password: password,
          displayName: name,
          disabled: false
        }).then(function(userRecord) {
          emitter.emit('create',dataCustomers)
          RegisterEmiiter.emit('welcome',{ name, email})
          ReferalEmmiter.emit('free_subscription',dataCustomers)
          return res.status(201).json({
            success : 'true',
            message :'Successfully Create user',
            data : userRecord
          });
        })
        .catch(function(error) {
          console.log("Error creating new user:", error);
          return res.status(500).json({
            success : 'false',
            message :error
          });
        });
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