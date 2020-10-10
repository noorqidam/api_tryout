"use strict"
const	express  	=	require('express');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const	router 		= 	express.Router();
const db        = require('../../../models/index');
const jwt       = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt  = require('bcryptjs');
const moment    = require('moment');
const TokenKey  = require('../../../config/tokenKey').Key;
/**
* [attributes] =>
* username: 'admin',
  displayname: 'admin',
  password: bcrypt.hashSync('rahasia123', salt),
  authorized: "EDUTORE",
  role: "ADMIN",
  accountkey:'EDUTOR',
  suspend: false
* @request body of Object type
*/

router.post('/',[
  check('username').not().isEmpty().withMessage('require'),
  check('password').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    const username = req.body.username;
    const password  = req.body.password;
    let now = moment().unix();
    try {
      const Admin = await db.utbk_admin.findOne({
        where :{
          username : {
            [Op.eq] : username
          },
          suspend : {
            [Op.eq] : false
          }
        }
      });

      if (Admin) {
        let check = bcrypt.compareSync(password, Admin.password);
        if (check) {
          const MyMenu = await db.utbk_mymenu.findAll({ 
            attributes:['name','url','icon','urutan'],
            include:[
              { model : db.mymenu_child ,as:'children' , attributes:['name','url','icon']}
            ],
            where : {
              user_id : {
                [Op.eq] : Admin.id
              }
            },
            order:[['urutan','ASC']]
          })
          let fixMenu = []
          MyMenu.forEach(element => {
            let child = element.children            
            if (child.length > 0) {
              fixMenu.push(element)  
            } else {
              fixMenu.push({
                name: element.name,
                url: element.url,
                icon: element.icon
              })
            }
            
          });
          try {
            let token = jwt.sign({
              id : Admin.id,
              username : Admin.username,
              displayname : Admin.displayname,
              authorized : Admin.authorized,
              accountkey : Admin.accountkey,
              role: Admin.role,
              time :now
            }, TokenKey, { expiresIn : '12h'});
            //payload
            let payload = {
              id  : Admin.id,
              username : Admin.username,
              displayname : Admin.displayname,
              authorized : Admin.authorized,
              accountkey : Admin.accountkey,
              role: Admin.role,
              token : token,
              menu: fixMenu
            };

            return res.status(201).json({
              success : 'true',
              message :'Success Login',
              data : payload
            });
          } catch (error) {
            console.log(error)
            return res.status(500).json({
              success : 'false',
              message :error
            }); 
          }
        } else {
          return res.status(226).json({
            success:'false',
            message:'Password invalid',
          })
        }
      } else {
        return res.status(404).json({
          success : 'false',
          message :'User Not Found'
        });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
  
});

module.exports	=	router;