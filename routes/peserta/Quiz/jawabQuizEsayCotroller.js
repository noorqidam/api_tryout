'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { JawabQuizEssay  } = require('../../../models/mongoose/JawabQuizEssay');
const { MySoalQuiz } = require('../../../models/mongoose/MySoalQuiz')
const { SoalQuiz } = require('../../../models/mongoose/SoalQuiz')
const mongoose = require('mongoose')
const moment = require('moment')

/**
* Save Jawaban
* quiz_id : 
  sesi_id : { type : Schema.Types.ObjectId, ref: 'Soalujian'},
  jawaban :{ JawabanSchema }
* @param	String/int 	 id
*
*/

router.post('/quiz/:id',[
  check('jawaban_text').not().isEmpty().withMessage('require'),
  check('soal_id').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let RealtimeSocket = res.io; // realtime socker
    // let auth = req.auth;
    let auth = {
      email:'rohmat771@gmail.com',
      picture:'null',
      uid: '4vu8oFWk9zfp1ISlm6yDychgxg13'
    }
    
    let id = req.params.id
    let soal = req.body.soal_id
    let jawaban_text = req.body.jawaban_text

    try {

      const GetSoalQuiz = await SoalQuiz.findOne({ quiz_id : id})
      var _id = mongoose.Types.ObjectId();
      let now = moment().format('YYYY-MM-DD')
      
      /** Get Data History Jawaban  */
      const CheckJawab = await JawabQuizEssay.findOne({
        email : auth.email,
        quiz_id: GetSoalQuiz.quiz_id,
        soal_id: soal,
        // date : {
        //   $gte: new Date(new Date(now).setHours(0, 0, 0)),
        //   $lt: new Date(new Date(now).setHours(23, 59, 59))
        // }
      });
      
      /** Check History Jawaban */
      if (CheckJawab) {
         /** Update Status Answered in MySoalQuiz */
         MySoalQuiz.findOne({ quiz_id : id ,user_id : auth.uid }, function (err, doc){
          if (err) {
            console.log(err)
          } else {
            doc.soals.id(soal).answered = true
            doc.save();
          }
        });
        return res.status(403).json({
          success : 'false',
          message :'Anda Telah Menjawab',
          data : CheckJawab
        });
      } else {
        /** Get Save Data Jawaban */
        const jawabaId = mongoose.Types.ObjectId();
        const SaveJawabQuiz = new JawabQuizEssay({
          _id: _id,
          quiz_id: GetSoalQuiz.quiz_id,
          soal_id: soal,
          email: auth.email,
          user_id: auth.uid,
          photo : auth.picture,
          jawaban: {
            _id: jawabaId,
            soal_id: soal,
            jawaban_text: jawaban_text
          }
        });
        //save
        let info = await SaveJawabQuiz.save();

        /** Update Status Answered in MySoalQuiz */
        MySoalQuiz.findOne({ quiz_id : id ,user_id : auth.uid }, function (err, doc){
          if (err) {
            console.log(err)
          } else {
            doc.soals.id(soal).answered = true
            doc.save();
          }
          
        });

        /** Get Current Ratting Quiz  for tryout.com*/
        // const RattingPeserta = await JawabQuiz.aggregate([
        //   { $match: { quiz_id: { $eq: GetSoalQuiz.quiz_id }} },
        //   {"$group" : { _id :{ user_id :"$user_id", photo :"$photo"},'count':{$sum:1} ,"total_point": { "$sum": "$jawaban.point" } }},
        //   { $sort: { "total_point": -1 }}
        // ]);

        /**Send Data Via Socket */
        RealtimeSocket.emit('jawab_quiz' + id, {info}) ///for admin
        // RealtimeSocket.emit('show_ratting'+id,{RattingPeserta}); //trigger realtime monitoring
        console.log('send message ratting ' + id)
        return res.status(201).json({
          success : 'true',
          message :'Success Save',
          data : info,
          //ratting: RattingPeserta
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