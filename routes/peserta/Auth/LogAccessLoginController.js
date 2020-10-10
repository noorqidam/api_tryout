'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { LoginAcceess } = require('../../../models/mongoose/LoginAccess')


/**
* Stored a newly created resource in storage.
*
* @request body of Object type
*/

router.post('/',async (req, res) => {
  try {
    const SaveLog = new LoginAcceess({
      email: req.body.email,
      ip_address: req.ip,
      status:'Login',
      createdAt:new Date()
    })
    const SaveLogLogin = await SaveLog.save()
    return res.status(201).json({
      success : 'true',
      message :'OK',
      data :'OK'
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