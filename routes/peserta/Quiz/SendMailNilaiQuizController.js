'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const MailService = require('../../../service/quiz/SendMailNilai')
const { JawabQuiz  } = require('../../../models/mongoose/JawabQuiz');
const { MySoalQuiz } = require('../../../models/mongoose/MySoalQuiz')
const { Quiz } = require('../../../models/mongoose/Quiz')
const moment = require('moment')
/**
* Send a Mail 
* Point Quiz
* @request body of Object type
*/

router.post('/',async (req, res) => {
  try {
    let auth = req.auth;
    let id = req.body.quiz_id;
    const GetQuiz = await Quiz.findById(id) 
    if (GetQuiz) {
      if (GetQuiz.type_start ==='REALTIMESOAL') {
        
          const RattingPeserta = await JawabQuiz.aggregate([
            { $match: 
              { 
                quiz_id: { $eq: GetQuiz._id}, 
                user_id :{ $eq : auth.uid},
              }}
          ]);
          
          let Benar = 0;
          let Point = 0;
          let Salah = 0;
          let totalSoal = RattingPeserta.length;
          
          RattingPeserta.forEach(element => {
            let info = element.jawaban;
            if (info.benar === true) {
              Point += info.point
              Benar++;
            } else if(info.benar===false){
              Salah ++;
            }
            
          });
  
          let dataNilai = {
            title:"Report hasil Quiz",
            email: auth.email,
            nama_peserta: auth.name,
            judul_quiz:GetQuiz.judul_quiz,
            penyelenggara:GetQuiz.penyelenggara,
            waktu_pelakasaan: moment(GetQuiz.start_date).format("DD MM YYYY") + "("+GetQuiz.times+' s/d '+GetQuiz.end_times+")",
            jumlahsoal:totalSoal,
            skor:Point,
            jawaban_benar:Benar,
            jawaban_salah:Salah
          }
          
          const Mails =  await MailService.SendMailNilaiQuiz(dataNilai,auth.email)
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data :Mails
          });
      } else {
        const GetCountSoal = await MySoalQuiz.findOne(
          {
            quiz_id: { $eq: GetQuiz._id},
            user_id: { $eq: auth.uid}
          })
          const RattingPeserta = await JawabQuiz.aggregate([
            { $match: 
              { 
                quiz_id: { $eq: GetQuiz._id}, 
                user_id :{ $eq : auth.uid},
              }}
          ]);
          
          let Benar = 0;
          let Point = 0;
          let Salah = 0;
          let totalSoal = GetCountSoal.soals;
          
          RattingPeserta.forEach(element => {
            let info = element.jawaban;
            if (info.benar === true) {
              Point += info.point
              Benar++;
            } else if(info.benar===false){
              Salah ++;
            }
            
          });
  
          let dataNilai = {
            title:"Report hasil Quiz",
            email: auth.email,
            nama_peserta: auth.name,
            judul_quiz:GetQuiz.judul_quiz,
            penyelenggara:GetQuiz.penyelenggara,
            waktu_pelakasaan: moment(GetQuiz.start_date).format("DD MM YYYY") + "("+GetQuiz.times+' s/d '+GetQuiz.end_times+")",
            jumlahsoal:totalSoal.length,
            skor:Point,
            jawaban_benar:Benar,
            jawaban_salah:Salah
          }
          
          const Mails =  await MailService.SendMailNilaiQuiz(dataNilai,auth.email)
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data :Mails
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
});


module.exports	=	router;