'use strict'
const	express  	=	require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const { ReferalRegister } = require('../../../models/mongoose/ReferalRegister')

/**
* Stored a newly created resource in storage.
*
* @request body of Object type
*/

router.post('/',[
  check('id').not().isEmpty().withMessage('Key id required')
],async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    return res.status(422).json({
      success: 'false',
      error: err
    })
  } else {
    try {
      let id = req.body.id
      const GetLinkRegisterReferal = await ReferalRegister.findOne({_id : id})
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data : GetLinkRegisterReferal
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :"link salah"
      });
    }
  }
});

module.exports	=	router;