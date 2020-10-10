"use strict"
const	express  	=	require('express');
const	router 		= 	express.Router();
const emitter = require('../../../listeners/registered');
const { check, validationResult } = require('express-validator');

/**
* Create resource
/ @request Body
*/
router.post('/',[
  check('email').not().isEmpty().isEmail(),
  check('user_id').not().isEmpty().withMessage('Uid Is Required'),
], async (req, res)=> {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let email = req.body.email;
    let user_id = req.body.user_id;
    let urlActivation = 'https://edutore.com/activate/'+ user_id;
    try {
      let dataMessage = {
        email : email,
        url   : urlActivation
      };
      emitter.emit('register',dataMessage)
      return res.status(201).json({
        success : 'true',
        message :'Berhasil',
        data :'Berhasil'
      });
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