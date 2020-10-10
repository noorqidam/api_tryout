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

router.get('/search',async (req, res) => {
  try {
    let query = req.query.referal_code
    const Referal = await db.referal.findAndCountAll({
      include:[ { model : db.agent_sale , as:'agent_sale' }],
      where : {
        referal_code: {
          [Op.like] :'%'+ query +'%'
        }
      },
      limit : 20
    });
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :Referal
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