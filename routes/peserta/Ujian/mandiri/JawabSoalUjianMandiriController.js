'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { JawabanUjian  } = require('../../../../models/mongoose/JawabanUjian');
const { SoalUjian  } = require('../../../../models/mongoose/Soalujian');
const { MySoalUjian } = require('../../../../models/mongoose/MySoalUjian')
const { Profile } = require('../../../../models/mongoose/profile')
const mongoose = require('mongoose')

/**
* Save Jawaban
* @param	int id
* @requires ujian_id
* @requires soal_id
* @requires jawaban_id
*/

router.post('/sesi-ujian/:id',[
  check('jawaban_id').not().isEmpty().withMessage('require'),
  check('soal_id').not().isEmpty().withMessage('require'),
  check('id').not().isEmpty().withMessage('require')
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let RealtimeSocket = res.io; // realtime socker
    let auth = req.auth;
    let ujian_id = req.body.ujian_id
    let sesi_id = req.body.sesi_id // Sesiujian_id
    let soal = req.body.soal_id // soal_id
    let jawaban_id = req.body.jawaban_id // jawaban_id

    try {
      const GetProfile = await Profile.findOne({ user_id : auth.uid})
      let J = null
      const GetSoalUjian = await SoalUjian.findOne({ _id : sesi_id}) 
      
      let Findsoal = GetSoalUjian.soals.id(soal)   
      
      if (Findsoal.type_soal ==='PG') {
        J = Findsoal.jawabans.id(jawaban_id)  
      } else {
        J = {
          /** untuk Soal Esay Secara default value point set 0 dan benar  =false */
          soal_id : soal,
          jawaban_text: req.body.jawaban_text,
          benar: false,
          point:0,
          is_verified: false
        }
      }
      
      var _id = mongoose.Types.ObjectId();
      
      const FIND_HISTORY_ANSWER = await JawabanUjian.findOne({ ujian_id:mongoose.Types.ObjectId(ujian_id) ,sesi_id:GetSoalUjian._id , soal_id: soal , user_id: auth.uid})
      if (GetSoalUjian) {
        if (GetSoalUjian.change_jawaban) {
          if (FIND_HISTORY_ANSWER) {
            console.log('ada ' + FIND_HISTORY_ANSWER)
            //update jawaban
            FIND_HISTORY_ANSWER.ujian_id = GetSoalUjian.ujian_id,
            FIND_HISTORY_ANSWER.sesi_id = GetSoalUjian._id,
            FIND_HISTORY_ANSWER.soal_id = soal,
            FIND_HISTORY_ANSWER.jawaban = J
            
            let info = await FIND_HISTORY_ANSWER.save();
            return res.status(201).json({
              success : 'true',
              message :'Success Update',
              data : info
            });
          } else {
           
            // Simpan Jawaban
             const JawabSoal = new JawabanUjian({
              _id: _id,
              ujian_id: GetSoalUjian.ujian_id,
              sesi_id: GetSoalUjian._id,
              soal_id: soal,
              type_soal: Findsoal.type_soal,
              email: auth.email ? auth.email : auth.uid,
              name: auth.name, 
              school: GetProfile ? GetProfile.school : null,
              kelas: GetProfile ? GetProfile.kelas: null,
              sub_kelas: GetProfile ? GetProfile.sub_kelas: null,
              profile_id:GetProfile ? GetProfile._id : null,
              user_id: auth.uid,
              photo : auth.picture,
              jawaban: J
            });
  
            let info = await JawabSoal.save();
            RealtimeSocket.emit('jawab_soal_ujian' + GetSoalUjian._id,{info}); //trigger realtime monitoring
            return res.status(201).json({
              success : 'true',
              message :'Success Save',
              data : info
            });
          }
        } else {
          if (FIND_HISTORY_ANSWER) {
            /** Update Status Answered in MySoalUjian */
            MySoalUjian.findOne({ ujian_id : GetSoalUjian.ujian_id, sesi_id:sesi_id ,user_id : auth.uid }, function (err, doc){
              doc.soals.id(soal).answered = true
              doc.save();
              console.log('Jawaban di update di MysoalUjian')
            });
            return res.status(409).json({
              success : 'false',
              message :'Anda Telah Menjawab'
            });
          } else {
            // Simpan Jawaban
             const JawabSoal = new JawabanUjian({
              _id: _id,
              ujian_id: GetSoalUjian.ujian_id,
              sesi_id: GetSoalUjian._id,
              soal_id: soal,
              type_soal: Findsoal.type_soal,
              email: auth.email ? auth.email : auth.uid,
              name: auth.name, 
              school: GetProfile ? GetProfile.school : null,
              kelas: GetProfile ? GetProfile.kelas: null,
              sub_kelas: GetProfile ? GetProfile.sub_kelas: null,
              profile_id:GetProfile ? GetProfile._id : null,
              user_id: auth.uid,
              photo : auth.picture,
              jawaban: J
            });
            
            /**
             /** Update Status Answered in MySoalUjian */
             MySoalUjian.findOne({ ujian_id : GetSoalUjian.ujian_id, sesi_id:sesi_id ,user_id : auth.uid }, function (err, doc){
              doc.soals.id(soal).answered = true
              doc.save();
              console.log('Jawaban di update di MysoalUjian')
            });

  
            let info = await JawabSoal.save();
            RealtimeSocket.emit('jawab_soal_ujian' + GetSoalUjian.ujian_id,{info}); //trigger realtime monitoring
            //console.log('socket '+ GetSoalUjian.ujian_id)
            return res.status(201).json({
              success : 'true',
              message :'Success Save',
              data : info
            });
          }
        }
        
     
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
  }
  
});

module.exports	=	router;