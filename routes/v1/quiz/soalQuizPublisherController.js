'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { SoalQuiz  } = require('../../../models/mongoose/SoalQuiz');
const mongoose = require('mongoose')


/**
* Display the specified resource
*
* @param	String/int 	 id
*
*/

router.get('/quiz',async (req, res) => {
  let id = req.query._id
  try {
    if (id) {
      const GetSoalQuiz = await SoalQuiz.find({ quiz_id : id})
      .populate({ path :'quiz_id'})
      
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data : GetSoalQuiz
      });
    } else {
      return res.status(400).json({
        success : 'false',
        message : 'Quiz id is Required'
      });
    }
    
  } catch (error) {
    console.log(error);
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

router.post('/',[
  check('quiz_id').not().isEmpty().withMessage('require'),
  check('soal').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    
    try {

      var id = mongoose.Types.ObjectId();
      const CreateUjian = new SoalQuiz({
        _id: id,
        quiz_id : req.body.quiz_id,
        duration: req.body.duration,
        soals : req.body.soal
      });

      let info = await CreateUjian.save();

      return res.status(201).json({
        success : 'true',
        message :'Success Save',
        data : info
      });
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
});


/**
 * Add Soal in Exist Soal Quiz
 *  Add Soal in Quiz
 */
router.post('/sub-soal',[
  check('quiz_id').not().isEmpty().withMessage('require'),
  check('soal').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    
    try {
      let soal = req.body.soal;
      let id = req.body.quiz_id;
      const GetQuizSoal = await SoalQuiz.findOne({ quiz_id : id});
      soal.forEach(element => {
        GetQuizSoal.soals.push(element);
      });
      GetQuizSoal.save(function (err) {
        if (err) {
          console.log(err)
          return res.status(500).json({
            success : 'false',
            message :err
          });
        }
        else {
          return res.status(201).json({
            success : 'true',
            success : 'true',
            message :'Success Save',
          });
        }
        console.log('Success!');
      });

      
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
});

/**
* Remove the specified resource from storage.
* 
* @param  String  id
* @param  String Soalid
*/
router.post('/soal_id/:soalid',async (req, res) => {
  try {
    console.log(req.body)
    let id        = req.body.quiz_id;
    let soal_id   = req.params.soalid;
    const GetSoalQuiz = await SoalQuiz.findOne({ quiz_id : id })
    GetSoalQuiz.soals.id(soal_id).remove();
    GetSoalQuiz.save(function (err) {
      if (err) return handleError(err);
      console.log('the subdocs were removed');
    });
    return res.status(201).json({
      success : 'true',
      message :'Success Delete',
      data :SoalQuiz
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