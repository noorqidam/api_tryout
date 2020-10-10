'use strict'
const	express  	=	require('express');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const	router 		= 	express.Router();
const db      = require('../../../models/index');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs')
const uuid = require('uuid/v4')
/**
* Stored a newly created resource in storage.
*
* @request body of Object type
*/

router.post('/',[
  check('username').not().isEmpty().withMessage('required'),
  check('password').not().isEmpty().withMessage('required'),
  check('menus').not().isEmpty().withMessage('required')
],async (req, res) => {
  const error = validationResult(req);
  if(!error.isEmpty()){
    return res.status(422).json({
      success: 'false',
      message: error
    });
  } else {
    let auth = req.auth
    const salt = bcrypt.genSaltSync(10);
    let username = req.body.username;
    let finalusername = username.replace(/\s/g,'');
    let password = req.body.password;
    let encrypt =  bcrypt.hashSync(password, salt);
    let displayname = username;
    let authorized = 'PARTNER'
    let role = req.body.role
    
    let menus = req.body.menus; 
    
    try {

      const getMasterMenus = await db.utbk_master_menu.findAll({
        where : {
          key: {
            [Op.eq]: auth.authorized
          }
        }
      });
      

      if (getMasterMenus) {

        let secureMenu =  await findKeyMenu(getMasterMenus ,menus);
        await db.utbk_admin.create({
          _id: uuid(),
          username: finalusername,
          displayname: displayname,
          password: encrypt,
          authorized: authorized,
          role: role,
          accountkey: auth.accountkey
        }).then(users => {
          secureMenu.forEach(menu => {
            return db.sequelize.transaction((t)=> {
              return db.utbk_mymenu.create({
                name:menu.name,
                url:menu.url,
                icon:menu.icon,
                user_id: users.id,
                urutan: menu.urutan
              }, {transaction: t})
                .then(rows => {
                  console.log('create child menu ')
                  if(menu.name ==='Ujian' || menu.name ==='Quiz'){
                    console.log('create child menu ' + menu.name)
                    let dataChild = [
                      { name:'Tambah',url: menu.url + '/create',icon:'fa fa-plus',mymenu_id:rows.id},
                      { name:'List',url: menu.url,icon:'fa fa-list-alt',mymenu_id:rows.id},
                    ]
                    return db.mymenu_child.bulkCreate(dataChild, { transaction : t})
  
                  } else if(menu.name==='Setting'){
                    return db.mymenu_child.create({
                      name:'Admin',
                      url:'admin',
                      icon:'fa fa-users',
                      mymenu_id:rows.id
                    }, { transaction : t})
                  } else if(menu.name ==='Report'){
                    let dataChild = [
                      { name:'Ujian',url: menu.url+ '/ujian',icon:'fa fa-leanpub',mymenu_id:rows.id},
                      { name:'Quiz',url: menu.url+ '/quiz',icon:'fa fa-leanpub',mymenu_id:rows.id},
                    ]
                    return db.mymenu_child.bulkCreate(dataChild, { transaction : t})
                  }
                  
                })
            })
          })
          
          return res.status(201).json({
            success : 'true',
            message :'Succes',
            data :users
          });
        })
       
        
      } else {
        return res.status(404).json({
          success : 'false',
          message :'Data Tidak Di Temukan'
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


async function findKeyMenu(master , menus) {
  let temp = Array()
  for (let index = 0; index < menus.length; index++) {
    let findKey = master.find(id => id.id === menus[index].id)
    if(findKey) {
      console.log('find key Menus ' + JSON.stringify(findKey))
      temp.push(findKey)
    }
  }

  return temp;
}


module.exports	=	router;