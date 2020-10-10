'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { JawabQuiz  } = require('../../../models/mongoose/JawabQuiz');
const { SoalQuiz } = require('../../../models/mongoose/SoalQuiz')
const mongoose = require('mongoose')

/**
* Save Jawaban
* quiz_id : 
  sesi_id : { type : Schema.Types.ObjectId, ref: 'Soalujian'},
  jawaban :{ JawabanSchema }
* @param	String/int 	 id
*
*/

router.post('/:id',[
  check('jawaban_id').not().isEmpty().withMessage('require'),
  check('soal_id').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let RealtimeSocket = res.io; // realtime socker
    let auth = req.auth;
    let id = req.params.id
    let soal = req.body.soal_id
    let jawaban_id = req.body.jawaban_id
    var _id = mongoose.Types.ObjectId();

   
    try {

      const GetSoalQuiz = await SoalQuiz.findOne({ quiz_id : id}) 
      let Findsoal = GetSoalQuiz.soals.id(soal)   
      let J = Findsoal.jawabans.id(jawaban_id)  
      
      // let now = moment().format('YYYY-MM-DD')
      
      /** Get Data History Jawaban  */
      const CheckJawab = await JawabQuiz.findOne({
        user_id : auth.uid,
        quiz_id: GetSoalQuiz.quiz_id,
        soal_id: soal
      });


      /** Check History Jawaban */
      if (CheckJawab) {
        return res.status(403).json({
          success : 'false',
          message :'Anda Telah Menjawab',
          data : CheckJawab
        });
      } else {
        /** Get Save Data Jawaban */
        const SaveJawabQuiz = new JawabQuiz({
          _id: _id,
          quiz_id: GetSoalQuiz.quiz_id,
          soal_id: soal,
          email: auth.email ? auth.email : auth.uid,
          name: auth.name,
          user_id: auth.uid,
          photo : auth.picture ? auth.picture : auth.uid,
          jawaban: J,
          createdAt: new Date().toString
        });
        //save
        let info = await SaveJawabQuiz.save();
        //MessageBrokerQuiz.createQueue('jawab_quiz',auth.name)
        RealtimeSocket.emit('jawab_quiz' + id, {info})
        return res.status(201).json({
          success : 'true',
          message :'Success Save',
          data : info
        });
      }
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
  
});

module.exports	=	router;