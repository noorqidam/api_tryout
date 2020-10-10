'use strict'
const	express  	=	require('express');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const	router 		= 	express.Router();
const db      = require('../../../models/index');


/**
* Display a listing of the resource
*
* @return array of Object
*/

router.post('/',async (req, res) => {
 try {
   const MasterMenu  = await db.utbk_master_menu.findAndCountAll({
    attributes: ['id','name','url','icon','urutan'],
    where : {
      key : {
        [Op.eq]:'PARTNER'
      }
    },
    order :[['urutan','ASC']]
   });
   return res.status(200).json({
    success : 'true',
    message :'Master Menu',
    data :MasterMenu
   });
 } catch (error) {
   console.log(error)
   return res.status(500).json({
    success : 'false',
    message :error
   });
 }
});


module.exports	=	router;