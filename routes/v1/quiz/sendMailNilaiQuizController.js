'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const {check, validationResult} = require('express-validator')
const MailService = require('../../../service/quiz/SendMailNilaiAdmin')
const moment = require('moment')
moment.locale('id')
/**
* Send a Mail 
* Point Quiz
* @request body of Object type
*/

router.post('/',async (req, res) => {
  try {
    let data = req.body
    let RealtimeSocket = res.io; // realtime socket
    data.map(async element =>{
      const info = { email: element.email }
      let dataNilai = {
              title:"Hasil " + element.judul_quiz,
              email: element.email,
              nama_peserta: element.nama_peserta,
              judul_quiz:element.judul_quiz,
              penyelenggara:element.penyelenggara,
              waktu_pelakasaan: moment(element.start_date).format("dddd, DD MMMM YYYY") + "("+element.times+' s/d '+element.end_times+")",
              jumlahsoal: element.jumlah_soal,
              skor: element.skor,
              jawaban_benar:element.jawaban_benar || '-',
              jawaban_salah:element.jawaban_salah || '-'
            }
      await MailService.SendMailNilaiQuiz(dataNilai, element.email)
      RealtimeSocket.emit('email_sent', { info })
    })
    return res.status(200).json({
      success: 'true',
      message: 'sending email'
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