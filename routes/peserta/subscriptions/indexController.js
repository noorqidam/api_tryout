'use strict'
const	express  	=	require('express');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const	router 		= 	express.Router();
const db      = require('../../../models/index');


/**
* Display the specified resource
*
* @param	String/int 	 id
*
*/

router.get('/',async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 100;
  let title = req.query.title
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'DESC';
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  try {

    if (title) {
      const GetPackageSubscription  = await db.package_subsciption.findAndCountAll({
        where : {
          package_name: {
            [Op.like] :'%'+ title +'%'
          },
          publish: {
            [Op.eq] :true
          }
        },
        limit : limit,
        offset : offset,
        order :[['id',ORDER]]
      });
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data : GetPackageSubscription
      });
    } else {
      const GetPackageSubscription  = await db.package_subsciption.findAndCountAll({
        where : {
          publish: {
            [Op.eq] :true
          }
        },
        limit : limit,
        offset : offset,
        order :[['id',ORDER]]
      });
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data : GetPackageSubscription
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


module.exports	=	router;