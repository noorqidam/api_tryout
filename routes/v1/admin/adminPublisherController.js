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

router.get('/',async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 100;
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'DESC';
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  let auth = req.auth;
  try {
    console.log('ini auth request data '+ auth)
    if (auth.role ==='ADMIN') {
      const GetAdmin = await db.utbk_admin.findAndCountAll({
        attributes:['id','username','displayname','role','accountkey','suspend','createdAt'],
        where: {
          accountkey: {
            [Op.eq]: auth.accountkey
          }
        },
        limit : limit,
        offset : offset,
        order :[['id',ORDER]]
      });
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data :GetAdmin
      });
    } else {
      return res.status(403).json({
        success : 'false',
        message :'UnAuthorized'
      });
    }
   
  } catch (error) {
    console.log(error)
    return res.status(500).json({
    success : 'false',
    message :error
    });
  }
});

/**
* Display the specified resource
*
* @param	String/int 	 id
*
*/

router.get('/:id',async (req, res) => {
  
});


module.exports	=	router;