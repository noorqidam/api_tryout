const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const { JawabanUjian } = require('../../../models/mongoose/JawabanUjian')
const {SoalUjian} = require('./../../../models/mongoose/Soalujian');
const {MySoalUjian} = require('./../../../models/mongoose/MySoalUjian');
const mongoose = require('mongoose');

router.get('/', [
  check('ujian_id').not().isEmpty().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    return res.status(422).json({
      success: 'false',
      error: err
    })
  } else {
    const {ujian_id} = req.query
    try {
      const GetSesiUjian = await SoalUjian.find({ujian_id: ujian_id}).populate('ujian_id', '_id judul_ujian').select('-soals')
      if (GetSesiUjian.length > 0) {
        const JumlahPeserta = await MySoalUjian.aggregate([
          {$match: { ujian_id: {$eq: GetSesiUjian[0].ujian_id._id}}},
          {"$group": {_id: {sesi_id: "$sesi_id"}, 'count': {$sum:1}}}
        ])
        let data = Array()
        JumlahPeserta.forEach(item => {
          const dataSesi = GetSesiUjian.filter(element => {
            const sesiId = item._id.sesi_id
            return element._id == sesiId
          })
          data.push({
            sesi_id: dataSesi[0]._id,
            sesi_ujian: dataSesi[0].sesi_ujian,
            total_peserta: item.count
          })
        })
        return res.status(200).json({
          success: 'true',
          judul_ujian: GetSesiUjian[0].ujian_id.judul_ujian,
          data: data
        })
      } else {
        return res.status(404).json({
          success: 'false',
          error: 'Not Found',
          msg: 'Sesi ujian of this Ujian does not exist'
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: 'false',
        error: error
      })
    }
  }
});

router.get('/peserta-sesi', [
  check('ujian_id').not().isEmpty().withMessage('required'),
  check('sesi_id').not().isEmpty().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    return res.status(422).json({
      success: 'false',
      error: err
    })
  } else {
    const {ujian_id, sesi_id} = req.query
    if (!mongoose.Types.ObjectId.isValid(ujian_id)) {
      return res.status(422).json({
        success: 'false',
        err: 'Invalid input',
        msg: 'Please sent a valid objectId for ujian_id'
      })
    } else {
      if (!mongoose.Types.ObjectId.isValid(sesi_id)) {
        return res.status(422).json({
          success: 'false',
          err: 'Invalid input',
          msg: 'Please sent a valid objectId for sesi_id'
        })
      } else {
        try {
          console.log('try enter');
          const GetSesiUjian = await SoalUjian.findOne({ujian_id: ujian_id, _id: sesi_id})
          let data = []
          if (GetSesiUjian) {
            console.log('sesiujian found');
            const max_point = GetSesiUjian.soals.length * 10;
            const getPeserta = await MySoalUjian.find({ujian_id: GetSesiUjian.ujian_id, sesi_id: GetSesiUjian._id}).populate('ujian_id', '_id judul_ujian penyelenggara start_date times end_times')
            const getStatusReview = await  JawabanUjian.find({sesi_id: sesi_id})
            
            if (getPeserta) {
              if (getPeserta.length) {
                getPeserta.forEach((item, index) => {
                  let isReviewed = [];
                  let is_reviewed = false;
                  let point = 0;
                  let countReviewed = 0;
                  console.log('seblum filter');
                  const userId = JSON.parse(JSON.stringify(item.user_id))
                  const getJawabanPeserta = getStatusReview.filter(element => {
                    return element.user_id == userId
                  })
                  const totalJawaban = getJawabanPeserta.length;              
                  if (getJawabanPeserta.length) {
                    getJawabanPeserta.forEach(data => {
                      const jawabanScore = data.jawaban.point || 0
                      if(data.jawaban.point != '' && data.jawaban.point != undefined){
                        isReviewed.push(true)
                        point += jawabanScore
                        countReviewed += 1
                      } else {
                        isReviewed.push(false)
                      }
                    })
                    if(getPeserta.length - 1 == index){
                      const check_is_reviewed = isReviewed.filter(result => {
                        return result == false
                      })
                      if(check_is_reviewed.length){
                        is_reviewed = false
                      } else {
                        is_reviewed = true
                      }
                    }
                    data.push({
                      email: item.email || item.user_id,
                      user_id: item.user_id,
                      nama_peserta: item.email || item.user_id,
                      judul_ujian: item.ujian_id.judul_ujian,
                      sesi_ujian: GetSesiUjian.sesi_ujian,
                      penyelenggara: item.ujian_id.penyelenggara,
                      start_date: item.ujian_id.start_date,
                      times: item.ujian_id.times,
                      end_times: item.ujian_id.end_times,
                      isReviewed: is_reviewed,
                      skor: point,
                      jumlah_soal: item.soals.length,
                      jumlah_dijawab: totalJawaban,
                      jawaban_di_review: `${countReviewed}/${totalJawaban}`
                    })
                  } else { 
                    console.log('tidak ikut jawab ujian');
                    let is_reviewed = true;
                    let point = 0;
                    let countReviewed = 0;
                    let totalJawaban = 0
                    data.push({
                      email: item.email || item.user_id,
                      user_id: item.user_id,
                      nama_peserta: item.email || item.user_id,
                      judul_ujian: item.ujian_id.judul_ujian,
                      sesi_ujian: GetSesiUjian.sesi_ujian,
                      penyelenggara: item.ujian_id.penyelenggara,
                      start_date: item.ujian_id.start_date,
                      times: item.ujian_id.times,
                      end_times: item.ujian_id.end_times,
                      isReviewed: is_reviewed,
                      skor: point,
                      jumlah_soal: item.soals.length,
                      jumlah_dijawab: totalJawaban,
                      jawaban_di_review: `${countReviewed}/${totalJawaban}`
                    })
                  }
                })
                return res.status(200).json({
                  success: 'true',
                  data: data
                })
              } else {
                return res.status(404).json({
                  success: 'false',
                  err: 'Not Found',
                  msg: 'Tidak ada peserta pada sesi ujian ini'
                })
              }
            } else {
              return res.status(404).json({
                success: 'false',
                err: 'Not Found',
                msg: 'Tidak ada data peserta dengan ujian_id ini'
              })
            }
          } else {
            return res.status(404).json({
              success: 'false',
              error: 'Not Found',
              msg: 'Sesi ujian of this Ujian does not exist'
            })
          }
        } catch (error) {
          return res.status(500).json({
            success: 'false',
            error: error
          })
        }
      }
    }
  }
});

router.get('/jawaban-peserta', [
  check('ujian_id').not().isEmpty().withMessage('required'),
  check('sesi_id').not().isEmpty().withMessage('required'),
  check('user_id').not().isEmpty().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    return res.status(422).json({
      success: 'false',
      error: err
    })
  } else {
    // console.log('no error');
    const {ujian_id, sesi_id, user_id} = req.query;
    if (!mongoose.Types.ObjectId.isValid(ujian_id)) {
      return res.status(422).json({
        success: 'false',
        err: 'Invalid input',
        msg: 'Please input a valid ObjectId of ujian_id'
      })
    } else {
      if (!mongoose.Types.ObjectId.isValid(sesi_id)) {
        return res.status(422).json({
          success: 'false',
          err: 'Invalid input',
          msg: 'Please input a valid ObjectId of sesi_id'
        })
      } else {     
        try {
          // console.log('try enter');
          const GetMySoalUjian = await MySoalUjian.findOne({ujian_id: ujian_id, sesi_id: sesi_id, user_id:user_id})
          if (GetMySoalUjian) {
            console.log('sesiujian found');
            const JawabanPeserta = await  JawabanUjian.find({ujian_id: GetMySoalUjian.ujian_id, sesi_id: GetMySoalUjian.sesi_id, user_id: GetMySoalUjian.user_id}).populate('soal_id', '_id soal_text')
            if(JawabanPeserta){
              if(JawabanPeserta.length > 0){
                let dataJawaban = [];
                let is_reviewed = false;
                let temp_point = 0;
                const total_soal = GetMySoalUjian.soals.length
                let max_point =  total_soal * 10;
        
                JawabanPeserta.forEach((item, index) => {
                  let isReviewed = false
                  if(item.jawaban.point != '' && item.jawaban.point != undefined){
                    isReviewed = true;
                    temp_point += item.jawaban.point
                  }
                  dataJawaban.push({
                    soal_id: item.soal_id._id,
                    soal_text: item.soal_id.soal_text,
                    jawaban_text: item.jawaban.jawaban_text,
                    nilai: item.jawaban.point || '',
                    comment: item.jawaban.comment || '',
                    reviewer: item.jawaban.reviewer || 'Belum di review',
                    isReviewed: isReviewed
                  })
                  if(JawabanPeserta.length-1 == index){
                    const cekIsReviewed = dataJawaban.filter(element => {
                      return element.isReviewed == false
                    })
                    console.log(cekIsReviewed.length);
                    
                    if(cekIsReviewed.length>0){
                      is_reviewed = false
                    } else {
                      is_reviewed = true
                    }
                  }
                })
                return res.status(200).json({
                  success: 'true',
                  data: dataJawaban,
                  email: GetMySoalUjian.email,
                  isReviewed: is_reviewed,
                  total_soal: total_soal,
                  soal_dijawab: JawabanPeserta.length,
                  temp_point: temp_point + ' out of ' + max_point,
                  temp_score: parseFloat((temp_point/max_point*100).toFixed(2))
                })
              } else {
                return res.status(404).json({
                  success: 'false',
                  err: 'Not Found',
                  msg: 'Tidak ada data jawaban peserta dari user ini'
                })
              }
            } else {
              return res.status(404).json({
                success: 'false',
                err: 'Not Found',
                msg: 'Query Error'
              })
            }
          } else {
            return res.status(404).json({
              success: 'false',
              error: 'Not Found',
              msg: 'Sesi ujian of this Ujian does not exist'
            })
          }
        } catch (error) {
          return res.status(500).json({
            success: 'false',
            error: error
          })
        }
      }
    }
  }
  
});

router.post('/', [
  check('ujian_id').not().isEmpty().withMessage('required'),
  check('sesi_id').not().isEmpty().withMessage('required'),
  check('soal_id').not().isEmpty().withMessage('required'),
  check('nilai').not().isEmpty().withMessage('required')
], async (req, res) => {
   const err = validationResult(req);
   if(!err.isEmpty()){
     return res.status(422).json({
       success: 'false',
       error: err
     })
   } else {
    //  console.log('else');
     
     const {soal_id, nilai, comment, user_id} = req.body;
     const {ujian_id, sesi_id} = req.query;
     if (!mongoose.Types.ObjectId.isValid(ujian_id)) {
      return res.status(422).json({
        success: 'false',
        err: 'Invalid input',
        msg: 'Please input a valid ObjectId of ujian_id'
      })
    } else {
      if (!mongoose.Types.ObjectId.isValid(sesi_id)) {
        return res.status(422).json({
          success: 'false',
          err: 'Invalid input',
          msg: 'Please input a valid ObjectId of sesi_id'
        })
      } else { 
        try {
          //  console.log('Try');
           
           const GetMyUjian = await MySoalUjian.findOne({ujian_id: ujian_id, sesi_id: sesi_id, user_id: user_id}).then((result) => {
             console.log('berhasil get ujian');
             return result
           }).catch((err) => {
             console.log(err);
             return undefined
           });
           
           if (GetMyUjian) {
            const JawabanEsayUjian = await  JawabanUjian.findOne({ujian_id: GetMyUjian.ujian_id, sesi_id: GetMyUjian.sesi_id, user_id: GetMyUjian.user_id, soal_id: soal_id}).then((result) => {
              return result
            }).catch((err) => {
              console.log(err);
              return undefined
            });
            if (JawabanEsayUjian) {
              const NilaiJawaban = {
                jawaban:{
                  _id: JawabanEsayUjian.jawaban._id,
                  soal_id: JawabanEsayUjian.jawaban.soal_id,
                  jawaban_text: JawabanEsayUjian.jawaban.jawaban_text,
                  point: nilai,
                  comment: comment || null,
                  reviewer: req.auth.username
                }
              }
              const info = await JawabanEsayUjian.updateOne(NilaiJawaban);
              return res.status(201).json({
                success: 'true',
                data: {
                  updated: NilaiJawaban.jawaban,
                  info:info
                }
              })
            } else {
              return res.status(404).json({
                success: 'false',
                error: 'Not Found',
                msg: 'Jawaban Not Found'
              })
            }
           } else {
             return res.status(404).json({
               success: 'false',
               error: 'Not Found',
               msg: 'The user data is not exist'
             })
           }
         } catch (error) {
           return res.status(500).json({
             success: 'false',
             error: error
           })
         }
      }
    }
   }
});
module.exports = router;
