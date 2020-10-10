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
    try {
     
      const GetUjian = await Ujian.findOne({ _id : id ,publish : true})
      
      if (GetUjian) {
        const getDate = moment(GetUjian.start_date).format('YYYY-MM-DD')
        const Hour = GetUjian.times
        const getHour = Hour.substring(0, 2)
        const getMinutes = Hour.substring(3, 5)

        const FullDateTime = moment(getDate).add(getHour, 'h').add(getMinutes, 'm')
        const StartDateTime = moment(FullDateTime).format('YYYY-MM-DD HH:mm')
        
        const DatetimesNow = moment().format('YYYY-MM-DD HH:mm')

        if (moment(DatetimesNow).isSameOrAfter(StartDateTime)) {
          if (GetUjian.is_premium) {
            //soal quiz premium
            const CheckUserInUjian = await PesertaUjian.findOne({
              email: { $eq: auth.email},
              ujian_id: { $eq: id}
            });
      
            if (CheckUserInUjian) {
              //find all Soal in Ujian 
              const GetSoalUjianInSesiId = await SoalUjian.findOne({
                ujian_id : GetUjian._id,
                _id: sesi_id
              },'-soals.publish -soals.deleted -soals.jawabans.benar -soals.jawabans.point')
              //'sesi_ujian duration soals._id soals.soal_text soals.soal_image soals.jawabans.soal_id soals.jawabans._id soals.jawabans.jawaban_text soals.jawabans.jawaban_image, soals.type_soal')
              if (GetSoalUjianInSesiId) {
                let Info ={}
                const MySoal = new MySoalUjian({
                  ujian_id: GetUjian._id,
                  sesi_id: sesi_id,
                  soals: GetSoalUjianInSesiId.soals,
                  duration: GetSoalUjianInSesiId.duration,
                  sesi_ujian: GetSoalUjianInSesiId.sesi_ujian,
                  email: auth.email,
                  user_id: auth.uid,
                  publisher_id: GetUjian.penyelenggara,
                  ip_address: req.ip
                })
                const getStartUjianInSesi = await StartUjian.findOne({
                  email: auth.email,
                  ujian_id: GetUjian._id,
                  sesi_id: sesi_id
                });
      
                if(!getStartUjianInSesi){
                  const SaveStartUjianInSesi = new StartUjian({
                    ujian_id: GetUjian._id,
                    user_id: auth.uid,
                    sesi_id: sesi_id,
                    email: auth.email,
                    start_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    end_time: null,
                    show_nilai: false,
                    publisher_id: GetUjian.penyelenggara,
                    ip_address: req.ip
                  })
                   Info = await SaveStartUjianInSesi.save();
                }
                let saveMySoal = await MySoal.save();
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
                  MySoal: saveMySoal,
                  info : Info
                });
              } else {
                return res.status(404).json({
                  success : 'false',
                  message :'Data SOal Tidak Di Temukan'
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
            //Ujian free
            const GetSoalUjianInSesiId = await SoalUjian.findOne({
              ujian_id : GetUjian._id,
              _id: sesi_id
            },'-soals.publish -soals.deleted -soals.jawabans.benar -soals.jawabans.point')
            if (GetSoalUjianInSesiId) {
              let Info ={}
              const MySoal = new MySoalUjian({
                ujian_id: GetUjian._id,
                sesi_id: sesi_id,
                soals: GetSoalUjianInSesiId.soals,
                duration: GetSoalUjianInSesiId.duration,
                sesi_ujian: GetSoalUjianInSesiId.sesi_ujian,
                email: auth.email,
                user_id: auth.uid,
                publisher_id: GetUjian.penyelenggara,
                ip_address: req.ip
              })
              const getStartUjianInSesi = await StartUjian.findOne({
                email: auth.email,
                ujian_id: GetUjian._id,
                sesi_id: sesi_id
              });
    
              if(!getStartUjianInSesi){
                const SaveStartUjianInSesi = new StartUjian({
                  ujian_id: GetUjian._id,
                  user_id: auth.uid,
                  sesi_id: sesi_id,
                  email: auth.email,
                  start_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                  end_time: null,
                  show_nilai: false,
                  publisher_id: GetUjian.penyelenggara,
                  ip_address: req.ip
                })
                 Info = await SaveStartUjianInSesi.save();
              }
              let saveMySoal = await MySoal.save();
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
                MySoal: saveMySoal,
                info : Info
              });
            } else {
              return res.status(404).json({
                success : 'false',
                message :'Data SOal Tidak Di Temukan'
              });
            }
          } 
        } else if(moment(DatetimesNow).isBefore(StartDateTime)){
          return res.status(409).json({
            success : 'false',
            message :'Ujian Belum di Mulai'
          });
        } else {
          return res.status(200).json({
            success : 'false',
            message :'Ujian Belum di Mulai atau sudah selesai'
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