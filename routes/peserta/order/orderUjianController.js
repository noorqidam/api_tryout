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
  try {
    let auth = req.auth
    const MyOrders = await db.order.findAndCountAll({
      where: {
        user_id: {
          [Op.eq]: auth.uid
        }
      }
    });

    return res.status(200).json({
      success : 'true',
      message :'Data Order Di Temukan',
      data :MyOrders
    });

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
  try {
    let auth = req.auth
    let id = req.params.id
    const MyOrders = await db.order.findOne({
      where: {
        user_id: {
          [Op.eq]: auth.uid
        },
        id: {
          [Op.eq]: id
        }
      }
    });

    return res.status(200).json({
      success : 'true',
      message :'Data Order Di Temukan',
      data :MyOrders
    });
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

/**
* Stored a newly created resource in storage.
*
* @request body of Object type
*/

router.post('/',async (req, res) => {
  let voucher_code = req.voucher_code;
  let ujian_id = req.body.ujian_id;
  let ip_address = req.ip;
  try {
    const ProsesOrder = await db.order.create({
      order_nomor : order_nomor,
      user_id: User.uid,
      email : User.email,
      code_voucher: voucher_code,
      voucher: TemDiscount,
      expire_at : expire_at,
      total_price : totalPurcase,
      payment_status: true,
      total_payment : TemCountPrice,
      ip_address  : ipAddress,
      categories:'MODULE',
      payment_method :'FREE'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});



module.exports	=	router;