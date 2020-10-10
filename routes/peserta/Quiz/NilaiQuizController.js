'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
//const { check, validationResult } = require('express-validator');
const { JawabQuiz  } = require('../../../models/mongoose/JawabQuiz');
const { StartQuiz } = require('../../../models/mongoose/StartQuiz')
const { MySoalQuiz } = require('../../../models/mongoose/MySoalQuiz')
const { Quiz } = require('../../../models/mongoose/Quiz')
const moment = require('moment')

/**
* Save Jawaban
* quiz_id : 
  sesi_id : { type : Schema.Types.ObjectId, ref: 'Soalujian'},
  jawaban :{ JawabanSchema }
* @param	String/int 	 id
*
*/

router.get('/',async (req, res) => {

    let auth = req.auth;
    let id = req.query.quiz_id
    // let auth  = {
    //   email :'hidir@gmail.com',
    //   uid: '9jesc9FuHd45nU56kNsdf90Hnf'
    // }
    let now = moment().format('YYYY-MM-DD')
    //let maxNow =  moment().add(1,'days').format('YYYY-MM-DD')
    try {
      let totalSoal = 0
      const GetQuiz = await Quiz.findById(id) 
      const RattingPeserta = await JawabQuiz.aggregate([
        { $match: 
          { 
            quiz_id: { $eq: GetQuiz._id}, 
            user_id :{ $eq : auth.uid},
            // date :{
            //   $gte: new Date(new Date(now).setHours(0, 0, 0)),
            //   $lt: new Date(new Date(now).setHours(23, 59, 59))
            // }
          }}
      ]);
      if (GetQuiz) {
        if (!GetQuiz.type_start==='REALTIMESOAL') {
          const GetStartQuiz =  await StartQuiz.findOne({ quiz_id: GetQuiz._id, user_id: auth.uid });
          const BodyStopedQuiz = {
            end_time: new Date().toString(),
            show_nilai: true
          }
          if (GetStartQuiz) {
            GetStartQuiz.updateOne(BodyStopedQuiz)  
          }
          totalSoal += RattingPeserta.length
        } else {
          const GetCountSoal = await MySoalQuiz.findOne({ quiz_id : GetQuiz._id, user_id: auth.uid})
         
          if (GetCountSoal) {
            //totalSoal = GetCountSoal.soals.length
            totalSoal = RattingPeserta.length
          } else {
            totalSoal += RattingPeserta.length
          }
        }

       
        
        let Benar = 0;
        let Point = 0;
        let Salah = 0;
        
       
        RattingPeserta.forEach(element => {
          let info = element.jawaban;
          if (info.benar === true) {
            Point += info.point
            Benar++;
          } else {
            Salah ++;
          }
          
        });
        return res.status(201).json({
          success : 'true',
          message :'Nilai Quiz Peserta ' + auth.email,
          data : RattingPeserta,
          quiz: GetQuiz,
          info : {
            "benar" : Benar,
            "salah" : Salah,
            "point" : Point,
            "soalDiJawab": RattingPeserta.length,
            "totalSoal" : totalSoal
          },
          //eval: SaveSession
        });
      } else {
        return res.status(404).json({
          success : 'false',
          message :'Data Tidak Di Temukan'
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

module.exports	=	router;