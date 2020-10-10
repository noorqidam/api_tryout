"use strict"
const	express  	=	require('express');
const	Sequelize	=	require('sequelize');
const	Op 			  = 	Sequelize.Op;
const	router 		= 	express.Router();
const db        =   require('../../../models/index');
const emitter = require('../../../listeners/registered');
var SimpleCrypto = require("simple-crypto-js").default;
const FirebaseAdmin  = require('../../../config/FirebaseAdmin');
const { check, validationResult } = require('express-validator');
const { Profile } = require('../../../models/mongoose/profile')
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
    let publisher_id  = req.body.publisher_id
    let user_id = mongoose.Types.ObjectId().toHexString()
    
    let urlActivation = 'https://edutore.com/activate/'+ user_id;
    let school = req.body.school ? req.body.school : null
    let valid_link = req.body.valid_link
    console.log('register User => ' + JSON.stringify(req.body))
    const _secretKey = "rohmatmret";
  
    const simpleCrypto = new SimpleCrypto(_secretKey)
    const chiperText = simpleCrypto.encrypt(password)
    
    try {
      
     const Referal = await db.referal.findOne({
        where : {
          referal_code : {
            [Op.eq] : req.body.referal_code
          },
          status : {
            [Op.eq] : true
          }
        }
      });
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
        
        const FindUserInStoredMysql = await db.customer.findOne({
          attributes:['email','createdAt'],
          where : {
            email : {
              [Op.eq] :email
            }
          }
        })
        console.log('Find data User in Databasee Mysql '+ FindUserInStoredMysql)
        if (FindUserInStoredMysql) {
          console.log('register data ' + JSON.stringify(FindUserInStoredMysql));
          return res.status(409).json({
            success : 'false',
            message :email + ' Telah Terdaftar di Edutore Silahkan Activasi' ,
            email: 'Terdaftar',
            phone : GetPhoneInFirebase ? 'Terdaftar' : 'Belum Terdaftar'
           
          });
        } else {
          console.log('run this to create new Users')
          let data = {
            email     : email,
            name      : name,
            user_id   : user_id,
            password  : chiperText,
            phone     : phone,
            referal_code : req.body.referal_code 
          }
          console.log(data)
          if (school && valid_link) {
            const Register =  await db.customer.create(data)
              .then(response => {
                const SaveProfile = new Profile({
                  name : name,
                  email: req.body.email,
                  user_id: user_id,
                  school : req.body.school,
                  kelas: req.body.kelas,
                  sub_kelas : req.body.sub_kelas,
                  publisher_id : publisher_id
                })
                let SaveDataProfile =  SaveProfile.save()
                let dataMessage = {
                  email : email,
                  url   : urlActivation
                };
                emitter.emit('register',dataMessage);  
                return res.status(201).json({
                  success : 'true',
                  message :'Success register ' +email,
                  data :  {
                    email     : email,
                    name      : name,
                    phone     : phone,
                    address   : address,
                    user_id :  user_id
                  },
                  profile : SaveDataProfile
                });
              })
          } else {
            const Register =  await db.customer.create(data)
            let dataMessage = {
              email : email,
              url   : urlActivation
            };
            emitter.emit('register',dataMessage);  
            return res.status(201).json({
              success : 'true',
              message :'Success register ' +email,
              data :  {
                email     : email,
                name      : name,
                phone     : phone,
                address   : address,
                user_id : user_id
              },
              profile : {}
            });
          }
        }
      }
    }  catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :"Server errror"
      });
    }
  }
  
});

module.exports	=	router;