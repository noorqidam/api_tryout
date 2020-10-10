'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { SoalUjian  } = require('../../../models/mongoose/Soalujian');
const { PesertaUjian } = require('../../../models/mongoose/PesertaUjian')
const { StartUjian } = require('../../../models/mongoose/StartUjian')
const { Ujian } = require('../../../models/mongoose/Ujian')
const { MySoalUjian } = require('../../../models/mongoose/MySoalUjian')
const moment = require('moment')
const { check, validationResult } = require('express-validator');
moment().locale('id')
const mongoose = require('mongoose');


/**
* Display the specified resource
*
* @param	String/int 	 id
* @requires auth
*/

router.post('/',
[
  check('ujian_id').not().isEmpty().withMessage('require'),
  check('sesi_id').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() ,validate : false });
  } else {
    let id = req.body.ujian_id;
    let sesi_id = req.body.sesi_id;
    let auth = req.auth;
    //let tempSesiUjian = Array();
    try {
     
      const GetUjian = await Ujian.findOne({ _id : id ,publish : true})
      
      if (GetUjian) {
        const getDate = moment(GetUjian.start_date).format('YYYY-MM-DD')
        const Hour = GetUjian.times
        const getHour = Hour.substring(0, 2)
        const getMinutes = Hour.substring(3, 5)

        const FullDateTime = moment(getDate).add(getHour, 'h').add(getMinutes, 'm')
        const StartDateTimeQuiz = moment(FullDateTime).format('YYYY-MM-DD HH:mm')
        
        const DatetimesNow = moment().format('YYYY-MM-DD HH:mm')

        if (moment(DatetimesNow).isSameOrAfter(StartDateTimeQuiz)) {
          if (GetUjian.is_premium) {
            //soal quiz premium
            const CheckUserInUjian = await PesertaUjian.findOne({
              email: { $eq: auth.email},
              ujian_id: { $eq: id}
            });
      
            if (CheckUserInUjian) {
              //find all Soal in  Sesi Ujian 
              const GetSoalUjianInSesiId = await SoalUjian.findOne({
                ujian_id : GetUjian._id,
                _id: sesi_id
              },'sesi_ujian duration soals._id soals.soal_text soals.soal_image soals.jawabans.soal_id soals.jawabans._id soals.jawabans.jawaban_text soals.jawabans.jawaban_image')
    
              if (GetSoalUjianInSesiId) {
                const StartUjians = new StartUjian({
                  ujian_id: GetUjian._id,
                  sesi_id: mongoose.Types.ObjectId(sesi_id), //compile to objectID
                  user_id: auth.uid,
                  email: auth.email,
                  start_time: new Date().toString(),
                  show_nilai: false,
                  publisher_id: GetUjian.penyelenggara
                })
                  /** Insert Data Soal to Mysoal */
                const MySoal = new MySoalUjian({
                  ujian_id: GetUjian._id,
                  sesi_id: sesi_id,
                  soals: GetSoalUjianInSesiId.soals,
                  duration: GetSoalUjianInSesiId.duration,
                  sesi_ujian: GetSoalUjianInSesiId.sesi_ujian,
                  email: auth.email,
                  user_id: auth.uid
                })

                let SaveMySoal = await MySoal.save();
                let SaveStartUjian = await StartUjians.save()
                return res.status(200).json({
                  success : 'true',
                  message :'Soal in Ujian',
                  soals : {
                    ujian_id: GetUjian._id,
                    sesi_id: sesi_id,
                    soals: GetSoalUjianInSesiId.soals,
                    email: auth.email
                  },
                  duration: GetSoalUjianInSesiId.duration,
                  sesi_ujian: GetSoalUjianInSesiId.sesi_ujian,
                  ujian: GetUjian,
                  info: SaveMySoal,
                  start: SaveStartUjian
                });
              } else {
                return res.status(404).json({
                  success : 'false',
                  message :'Data Tidak Di Temukan'
                });
              }
              
      
            } else {
              return res.status(404).json({
                success : 'false',
                message :'Anda Tidak Terdaftar Dalam Ujian Ini',
                data: {
                  code :'Anda Belum Terdaftar Dalam Ujian ini'
                }
              });
            }
          } else {
      
            const GetSoalUjianInSesiId = await SoalUjian.findOne({
              ujian_id : GetUjian._id,
              _id: sesi_id
            },
            '-soals.publish -soals.deleted -soals.jawabans.benar -soals.jawabans.point')
            
            if (GetSoalUjianInSesiId) {
              const StartUjians = new StartUjian({
                ujian_id: GetUjian._id,
                sesi_id: mongoose.Types.ObjectId(sesi_id), //compile to objectID
                user_id: auth.uid,
                email: auth.email,
                start_time: new Date().toString(),
                show_nilai: false,
                publisher_id: GetUjian.penyelenggara,
                createdAt : new Date().toString()
              })
              const MySoal = new MySoalUjian({
                ujian_id: GetUjian._id,
                sesi_id: sesi_id,
                soals: GetSoalUjianInSesiId.soals,
                duration: GetSoalUjianInSesiId.duration,
                sesi_ujian: GetSoalUjianInSesiId.sesi_ujian,
                email: auth.email,
                user_id: auth.uid,
                createdAt : new Date().toString()
              })
              let Info = await MySoal.save();
              let SaveStartUjian = await StartUjians.save()
              return res.status(200).json({
                success : 'true',
                message :'Soal in Ujian',
                soals : {
                  ujian_id: GetUjian._id,
                  sesi_id: sesi_id,
                  soals: GetSoalUjianInSesiId.soals,
                  email: auth.email,
                  user_id: auth.uid
                },
                duration: GetSoalUjianInSesiId.duration,
                sesi_ujian: GetSoalUjianInSesiId.sesi_ujian,
                ujian: GetUjian,
                info: Info,
                start: SaveStartUjian
              });
            } else {
              return res.status(404).json({
                success : 'false',
                message :'Data Tidak Di Temukan'
              });
            }
          } 
        } else {
          return res.status(200).json({
            success : 'false',
            message :'Ujian Belum di Mulai'
          });
        }
      } else {
        return res.status(404).json({
          success : 'false',
          message :' Ujian Tidak Di Temukan'
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