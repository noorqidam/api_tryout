'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { SoalQuiz  } = require('../../../models/mongoose/SoalQuiz');
const { PesertaQuiz } = require('../../../models/mongoose/PesertaQuiz')
const { StartQuiz } = require('../../../models/mongoose/StartQuiz')
const { Quiz } = require('../../../models/mongoose/Quiz')
const { MySoalQuiz } = require('../../../models/mongoose/MySoalQuiz')
const moment = require('moment')
const { check, validationResult } = require('express-validator');
moment().locale('id')


/**
* Display the specified resource
*
* @param	String/int 	 id
* @requires auth
*/

router.post('/',
[
  check('quiz_id').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() ,validate : false });
  } else {
    let id = req.body.quiz_id;
    let auth = req.auth;
    // let auth =  {
    //   email:'rohmat771@gmail.com'
    // }
    try {
     
      const GetQuiz = await Quiz.findOne({ _id : id ,publish : true})
      
      if (GetQuiz) {
        const getDate = moment(GetQuiz.start_date).format('YYYY-MM-DD')
        const Hour = GetQuiz.times
        const getHour = Hour.substring(0, 2)
        const getMinutes = Hour.substring(3, 5)

        const FullDateTime = moment(getDate).add(getHour, 'h').add(getMinutes, 'm')
        const StartDateTimeQuiz = moment(FullDateTime).format('YYYY-MM-DD HH:mm')
        
        const DatetimesNow = moment().format('YYYY-MM-DD HH:mm')

        if (moment(DatetimesNow).isSameOrAfter(StartDateTimeQuiz)) {
          if (GetQuiz.is_premium) {
            //soal quiz premium
            const CheckUserInQuiz = await PesertaQuiz.findOne({
              email: { $eq: auth.email},
              quiz_id: { $eq: id}
            });
      
            if (CheckUserInQuiz) {
              //find all Soal in Quiz 
              const  GetSoalQuiz = await SoalQuiz.findOne({ quiz_id : id},
                '-soals.publish -soals.deleted -soals.jawabans.benar -soals.jawabans.point')
                .populate({ path :'quiz_id'})

              const getStartQuiz = await StartQuiz.findOne({
                user_id: auth.uid,
                quiz_id: GetQuiz._id
              });
    
              if(!getStartQuiz){
               
                const SaveStartQuiz = new StartQuiz({
                  quiz_id: GetQuiz._id,
                  user_id: auth.uid,
                  email: auth.email,
                  start_time: new Date().toString(),
                  end_time: null,
                  nilai: 0,
                  show_nilai: false,
                })
                const MySoal = new MySoalQuiz({
                  quiz_id: GetQuiz._id,
                  soals: GetSoalQuiz.soals,
                  email: auth.email,
                  user_id: auth.uid
                })
                
                MySoal.save();

                let Info = await SaveStartQuiz.save();
                return res.status(200).json({
                  success : 'true',
                  message :'Data Soal Di Temukan ' + auth.email,
                  soals : GetSoalQuiz,
                  quiz: GetQuiz,
                  info: Info
                });

              } else {
                return res.status(200).json({
                  success : 'true',
                  message :'Data Soal Di Temukan ' + auth.email,
                  soals : GetSoalQuiz,
                  info: getStartQuiz
                });
              }
              
      
            } else {
              return res.status(404).json({
                success : 'false',
                message :'Anda Tidak Terdaftar Dalam Quiz Ini',
                data: {
                  code :'Anda Belum Terdaftar Dalam Quiz ini'
                }
              });
            }
          } else {
      
            const  GetSoalQuiz = await SoalQuiz.findOne({ quiz_id : id},
              '-soals.publish -soals.deleted -soals.jawabans.benar -soals.jawabans.point')
              .populate({ path :'quiz_id'})
              const getStartQuiz = await StartQuiz.findOne({
                user_id: auth.uid,
                quiz_id: GetQuiz._id
              });
              if (GetSoalQuiz) {
                const MySoal = new MySoalQuiz({
                  quiz_id: GetQuiz._id,
                  soals: GetSoalQuiz.soals,
                  email: auth.email,
                  user_id: auth.uid
                })
                MySoal.save();
                if(!getStartQuiz){
                  const SaveStartQuiz = new StartQuiz({
                    quiz_id: GetQuiz._id,
                    user_id: auth.uid,
                    email: auth.email,
                    start_time: moment(),
                    end_time: null,
                    show_nilai: false,
                  })
                  let Info = await SaveStartQuiz.save();
                  return res.status(200).json({
                    success : 'true',
                    message :'Soal in Quiz',
                    soals : {
                      quiz_id: GetQuiz._id,
                      soals: GetSoalQuiz.soals,
                      email: auth.email
                    },
                    quiz: GetQuiz,
                    info: Info
                  });
                } else {
                  return res.status(200).json({
                    success : 'true',
                    message :'Soal in Quiz',
                    soals : {
                      quiz_id: GetQuiz._id,
                      soals: GetSoalQuiz.soals,
                      email: auth.email
                    },
                    quiz: GetQuiz
                  });
                }   
              } else {
                return res.status(404).json({
                  success : 'false',
                  message :'Data Soal Tidak Di Temukan'
                });
              }
              
          } 
        } else {
          return res.status(200).json({
            success : 'false',
            message :'Quiz Belum di Mulai'
          });
        }
      } else {
        return res.status(404).json({
          success : 'false',
          message :' Quiz Tidak Di Temukan'
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