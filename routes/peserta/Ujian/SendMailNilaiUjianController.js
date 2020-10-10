'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const MailService = require('../../../service/quiz/SendMailNilai')
const { JawabanUjian  } = require('../../../models/mongoose/JawabanUjian');
const { MySoalUjian } = require('../../../models/mongoose/MySoalUjian')
const { Ujian } = require('../../../models/mongoose/Ujian')

/**
* Send a Mail 
* Point Quiz
* @request body of Object type
*/

router.post('/',async (req, res) => {
  try {
    let auth = req.auth;
    const getUjian = await Ujian.findById(id) 
    if (getUjian) {
      const GetCountSoal = await MySoalQuiz.findOne({ quiz_id : GetQuiz._id, user_id: auth.uid})
        const RattingPeserta = await JawabanUjian.aggregate([
          { $match: 
            { 
              quiz_id: { $eq: GetQuiz._id}, 
              user_id :{ $eq : auth.uid},
            }}
        ]);
        
        let Benar = 0;
        let Point = 0;
        let Salah = 0;
        let totalSoal = 0
        if (GetCountSoal) {
          totalSoal = GetCountSoal.soals.length
        }
        RattingPeserta.forEach(element => {
          let info = element.jawaban;
          if (info.benar === true) {
            Point += info.point
            Benar++;
          } else {
            Salah ++;
          }
          
        });

        info = {
          "benar" : Benar,
          "salah" : Salah,
          "point" : Point,
          "totalSoal" : totalSoal
        }

        const Mails =  MailService.SendMailNilaiQuiz(info,auth.email)
        return res.status(201).json({
          success : 'true',
          message :'Success',
          data :Mails
        });
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