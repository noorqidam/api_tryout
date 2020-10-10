const express = require('express');
const router = express.Router();
const {check, validationResult} =  require('express-validator');
const {JawabanUjianEssay} = require('./../../../models/mongoose/JawabanUjianEssay');
const {SoalUjian} = require('./../../../models/mongoose/Soalujian');
const {MySoalUjian} = require('./../../../models/mongoose/MySoalUjian');
const mongoose = require('mongoose')


// router.post('/sesi-ujian/:id', [
//   check('jawaban_id').not().isEmpty().withMessage('required'),
//   check('soal_id').not().isEmpty().withMessage('required'),
//   check('')
// ])

router.post('/sesi-ujian/:ujian_id',[
  check('jawaban_text').not().isEmpty().withMessage('require'),
  check('soal_id').not().isEmpty().withMessage('require'),
  check('sesi_id').not().isEmpty().withMessage('require'),
  check('ujian_id').not().isEmpty().withMessage('require')
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let RealtimeSocket = res.io;
    // let auth = req.auth;
    let auth = {
      email:'apdy@gmail.com',
      uid: '9jesc9FuHd45nU56kNsdf90Hnf'
    };
    let ujian_id = req.body.ujian_id
    let sesi_id = req.body.sesi_id
    let soal = req.body.soal_id
    let jawaban_text = req.body.jawaban_text

    try {
      const GetSoalUjian = await SoalUjian.findOne({ _id : sesi_id})
      let Findsoal = GetSoalUjian.soals.id(soal)
      let Jawaban = Findsoal.jawabans._id
      var _id = mongoose.Types.ObjectId();
      
      const history_jawaban = await JawabanUjianEssay.findOne({ sesi_id:GetSoalUjian._id , soal_id: soal , user_id: auth.uid}).then(item=>{
        console.log('success');
        return item
      }).catch(err => {
        console.log(err);
        return undefined
      })
      if (GetSoalUjian) {
        if (GetSoalUjian.change_jawaban) {
          if (history_jawaban) {
            console.log('ada ' + history_jawaban)
            history_jawaban.ujian_id = GetSoalUjian.ujian_id,
            history_jawaban.sesi_id = GetSoalUjian._id,
            history_jawaban.soal_id = soal,
            history_jawaban.jawaban = jawaban_text
            
            let info = await history_jawaban.save();
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
              email: auth.email ? auth.email : auth.uid,
              user_id: auth.uid,
              jawaban: Jawaban
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
          if (history_jawaban) {
            console.log('sudah di jawab');
            
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
            console.log('belum dijawab');
            
             const JawabSoal = new JawabanUjianEssay({
              _id: _id,
              ujian_id: GetSoalUjian.ujian_id,
              sesi_id: GetSoalUjian._id,
              soal_id: soal,
              email: auth.email ? auth.email : auth.uid,
              user_id: auth.uid,
              jawaban: {
                _id: mongoose.Types.ObjectId(),
                soal_id: soal,
                jawaban_text: jawaban_text
              }
            });
            /**
             * 
             */
             /** Update Status Answered in MySoalUjian */
             MySoalUjian.findOne({ ujian_id : GetSoalUjian.ujian_id, sesi_id:sesi_id ,user_id : auth.uid }, function (err, doc){
              doc.soals.id(soal).answered = true
              doc.save();
              console.log('Jawaban di update di MysoalUjian')
            });

            let info = await JawabSoal.save();
            RealtimeSocket.emit('jawab_soal_ujian' + GetSoalUjian.ujian_id,{info}); //trigger realtime monitoring
            console.log('socket '+ GetSoalUjian.ujian_id)
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