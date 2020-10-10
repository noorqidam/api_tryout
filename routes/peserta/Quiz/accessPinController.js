'use strict'
const	express  	=	require('express');
const jwt       = require('jsonwebtoken');
const TokenKey  = require('../../../config/tokenKey').Key;
const { Quiz  } = require('../../../models/mongoose/Quiz');
const { QuizAccess } = require('../../../models/mongoose/QuizAccess')
const { check, validationResult } = require('express-validator');
const	router 		= 	express.Router();

/**
* Stored a newly created resource in storage.
*
* @request body of Object type
*/

router.post('/',
  [
    check('quiz_id').not().isEmpty().withMessage('require'),
    check('pin').not().isEmpty().withMessage('require'),
  ]
,async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() ,validate : false });
  } else {
    let id = req.body.quiz_id;
    let auth = req.auth;
    let pin = req.body.pin
    try {
      console.log(req.body)
      const GetQuiz = await Quiz.findById(id)
      if (GetQuiz) {
        const GetAccessQuiz= await QuizAccess.findOne({ quiz_id : GetQuiz._id })
        if (GetAccessQuiz) {
          //console.log(GetAccessQuiz)
          if (GetAccessQuiz.acces_pin === pin) {
            let token = jwt.sign({
              auth : auth,
              quiz_id: id,
              time : new Date().toString()
            }, TokenKey, { expiresIn : '1h'});
            return res.status(201).json({
              success : 'true',
              message :'Validate True',
              token: token,
              data :req.body
            });
          } else {
            return res.status(200).json({
              success : 'false',
              message :'PIN Salah'
            });
          }
        } else {
          return res.status(200).json({
            success : 'false',
            message :'Quiz Tidak Menggunakan PIN'
          });
        }
        
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

module.exports	=	router;