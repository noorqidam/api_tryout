const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {Quiz} = require('../../../models/mongoose/Quiz');
const {SoalQuiz} = require('../../../models/mongoose/SoalQuiz')
const {MySoalQuiz} = require('../../../models/mongoose/MySoalQuiz')
const { JawabQuiz } = require('../../../models/mongoose/JawabQuiz')
const mongoose = require('mongoose')

router.get('/', [
  check('quiz_id').not().isEmpty().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    return res.status(422).json({
      success: 'false',
      error: err
    })
  } else {
    const {quiz_id} = req.query
    if (!mongoose.Types.ObjectId.isValid(quiz_id)) {
      return res.status(422).json({
        success: 'false',
        err: 'Invalid input',
        msg: 'Please send a valid ObjectId of quiz_id'
      })
    } else {
      try {
        const GetSoalQuiz = await SoalQuiz.findOne({quiz_id: quiz_id}).populate('quiz_id', '_id judul_quiz penyelenggara start_date times end_times');
         
        if(GetSoalQuiz){
          const cekSoalEsay = GetSoalQuiz.soals.filter(x=>{
            return x.type_soal === 'ESAY'
          })
          if(cekSoalEsay !== undefined && cekSoalEsay.length > 0){
            const GetPeserta = await MySoalQuiz.find({quiz_id: quiz_id})
            if (GetPeserta.length) {
              
              const total_soal = GetSoalQuiz.soals.length;
              const total_soal_esay = cekSoalEsay.length;
              const max_point = total_soal_esay * 10;
              const getStatusReview = await JawabQuiz.find({quiz_id: quiz_id, type_soal: 'ESAY'})
              let data = [];
              
              GetPeserta.forEach((item, index) => {
                let isReviewed = [];
                let is_reviewed = false;
                let point = 0;
                let countReviewed = 0;
                console.log('seblum filter');
                const getJawabanPeserta = getStatusReview.filter(element => {
                  return element.user_id === item.user_id
                })
                const totalJawaban = getJawabanPeserta.length
                if(getJawabanPeserta.length){
                  getJawabanPeserta.forEach((data, index) => {
                    const jawaban = JSON.parse(JSON.stringify(data.jawaban))
                    const jawabanScore = jawaban.point || 0
                    if(jawaban.point != '' && jawaban.point != undefined){
                      isReviewed.push(true)
                      countReviewed += 1
                      point += jawabanScore
                    } else {
                      isReviewed.push(false)
                    }
                    if(getJawabanPeserta.length-1 == index){
                      const cekIsReviewed = isReviewed.filter(element => {
                        return element == false
                      })
                      if(cekIsReviewed.length){
                        is_reviewed = false
                      } else {
                        is_reviewed = true
                      }
                    }
                  })
                  data.push({
                    email: item.email || item.user_id,
                    user_id: item.user_id,
                    nama_peserta: item.email || item.user_id,
                    judul_quiz: item.quiz_id.judul_quiz,
                    penyelenggara: item.quiz_id.penyelenggara,
                    start_date: item.quiz_id.start_date,
                    times: item.quiz_id.times,
                    end_times: item.quiz_id.end_times,
                    user_id: item.user_id,
                    isReviewed: is_reviewed,
                    skor: parseFloat((point/max_point*100).toFixed(2)),
                    point: point + '/' + max_point,
                    total_soal: total_soal,
                    total_soal_esay: total_soal_esay,
                    soal_esay_dijawab: totalJawaban,
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
                    nama_peserta: item.email || item.user_id,
                    judul_quiz: item.quiz_id.judul_quiz,
                    penyelenggara: item.quiz_id.penyelenggara,
                    start_date: item.quiz_id.start_date,
                    times: item.quiz_id.times,
                    end_times: item.quiz_id.end_times,
                    user_id: item.user_id,
                    isReviewed: is_reviewed,
                    skor: parseFloat((point/max_point*100).toFixed(2)),
                    point: point + '/' + max_point,
                    total_soal: total_soal,
                    total_soal_esay: total_soal_esay,
                    soal_esay_dijawab: totalJawaban,
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
                error: 'Not Found',
                msg: 'No user record on this quiz'
              })
            }
          } else {
            return res.status(404).json({
              success: 'false',
              error: 'Not Found',
              msg: 'No Soal Esay in this quiz'
            })
          }
        } else {
          return res.status(404).json({
            success: 'false',
            error: 'Not Found',
            msg: 'Soal quiz not found'
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
  }
});

router.get('/quiz', [
  check('user_id').not().isEmpty().withMessage('required'),
  check('quiz_id').not().isEmpty().withMessage('required'),
], async (req, res) => {
   const err = validationResult(req);
   if(!err.isEmpty()){
     return res.status(422).json({
       success: 'false',
       error: err
     })
   } else {
     const {user_id, quiz_id} = req.query;
     if (!mongoose.Types.ObjectId.isValid(quiz_id)) {
      return res.status(422).json({
        success: 'false',
        err: 'Invalid input',
        msg: 'Please input a valid ObjectId of ujian_id'
      })
    } else {
      try {
        // cari data peserta => mengikuti atau tidak mengikuti quiz
        const GetMySoalQuiz = await MySoalQuiz.findOne({quiz_id: quiz_id, user_id: user_id})
        if (GetMySoalQuiz) {
          const total_soal = GetMySoalQuiz.soals.length;
          const soal_esay = GetMySoalQuiz.soals.filter( x => {
            return x.type_soal === 'ESAY'
          })
          const total_soal_esay = soal_esay.length;
          
          if(soal_esay !== undefined && soal_esay.length > 0){
            const JawabanPeserta = await JawabQuiz.find({quiz_id: GetMySoalQuiz.quiz_id, user_id: GetMySoalQuiz.user_id}).populate('soal_id', '_id soal_text soal_image')
            if (JawabanPeserta.length) {
              const jawaban_esay = JawabanPeserta.filter(x => {
                return x.type_soal === 'ESAY'
              })
              let dataJawaban = [];
              let is_reviewed = false;
              let temp_point = 0;
              const max_point = total_soal_esay * 10;
              JawabanPeserta.forEach((element, index) => {
                let isReviewed = false;
                
                if (element.type_soal === 'ESAY') {
                  
                  if(element.jawaban.point != '' && element.jawaban.point != undefined){
                    isReviewed = true,
                    temp_point += element.jawaban.point
                  }
                  dataJawaban.push({
                    soal_id: element.soal_id._id,
                    soal_text: element.soal_id.soal_text,
                    soal_image: element.soal_id.soal_image || null,
                    jawaban_text: element.jawaban.jawaban_text,
                    point: element.jawaban.point || '',
                    comment: element.jawaban.comment|| '',
                    jawaban_image: element.jawaban.jawaban_image || null,
                    reviewer: element.jawaban.point ? element.jawaban.reviewer || 'reviewer is not recorded' : 'Belum direview',
                    type_soal: element.type_soal,
                    isReviewed: isReviewed
                  });
                } else {
                  
                  dataJawaban.push({
                    soal_id: element.soal_id._id,
                    soal_text: element.soal_id.soal_text,
                    soal_image: element.soal_id.soal_image || null,
                    jawaban_text: element.jawaban.jawaban_text,
                    point: element.jawaban.point || '',
                    comment: element.jawaban.comment|| 'ini objective',
                    jawaban_image: element.jawaban.jawaban_image || null,
                    reviewer: element.jawaban.reviewer || 'ini objective',
                    type_soal: element.type_soal,
                    isReviewed: true
                  });
                }
                if(JawabanPeserta.length - 1 == index){
                  const checkIsReviewed = dataJawaban.filter(result => {
                    return result.isReviewed == false
                  })
                  if(checkIsReviewed.length){
                    is_reviewed = false
                  } else {
                    is_reviewed = true
                  }
                }
              });
              return res.status(200).json({
                success: 'true',
                data: dataJawaban,
                email:GetMySoalQuiz.email,
                isReviewed: is_reviewed,
                total_soal: total_soal,
                total_soal_esay: total_soal_esay,
                soal_esay_dijawab: jawaban_esay.length,
                temp_point: temp_point + ' out of ' + max_point,
                temp_score: parseFloat((temp_point/max_point*100).toFixed(2))
              })
            } else {
             return res.status(404).json({
               success: 'false',
               error: 'Not Found',
               msg: 'Data Jawaban peserta tidak ditemukan'
             });
            }
          } else {
            return res.status(404).json({
              success: 'false',
              error: 'Not Found',
              msg: 'Tidak ada soal esay di quiz ini'
            })
          }
        } else {
          return res.status(404).json({
            success: 'false',
            error: 'Not Found',
            msg: 'Data Peserta pada quiz ini tidak ada'
          });
        }
      } catch (error) {
        return res.status(500).json({
          success: 'false',
          error: error
        })
      }
    }  
  }
});

router.post('/', [
  check('quiz_id').notEmpty().withMessage('required'),
  check('user_id').notEmpty().withMessage('required'),
  check('soal_id').notEmpty().withMessage('required'),
  check('nilai').notEmpty().withMessage('required')
], async (req, res) => {
const err = validationResult(req);
if (!err.isEmpty()) {
  return res.status(422).json({
    success: 'false',
    error: err
  })
} else {
  const {quiz_id} = req.query;
  const {user_id, soal_id, nilai, comment} = req.body;
  if (!mongoose.Types.ObjectId.isValid(quiz_id)) {
    return res.status(422).json({
      success: 'false',
      err: 'Invalid input',
      msg: 'Please send a valid ObjectId of quiz_id'
    })
  } else { 
    try {
      const GetMySoalQuiz = await MySoalQuiz.findOne({quiz_id: quiz_id, user_id: user_id})
      if (GetMySoalQuiz) {
        const JawabanPeserta = await JawabQuiz.findOne({quiz_id: GetMySoalQuiz.quiz_id, user_id: GetMySoalQuiz.user_id, soal_id: soal_id, type_soal: 'ESAY'})
        if (JawabanPeserta) {
          const jawabanReview = {
            jawaban:{
              _id: JawabanPeserta.jawaban._id,
              soal_id: JawabanPeserta.jawaban.soal_id,
              jawaban_text: JawabanPeserta.jawaban.jawaban_text,
              point: nilai,
              comment: comment || '',
              reviewer: req.auth.username
            }
          }
          const info = await JawabanPeserta.updateOne(jawabanReview);
          return res.status(201).json({
            success: 'true',
            data: {
              updatedData: jawabanReview.jawaban,
              info: info
            }
          })
        } else {
          return res.status(404).json({
            success: 'false',
            error: 'Not Found',
            msg: 'Data jawaban peserta tidak ada'
          })
        }
      } else {
        return res.status(404).json({
          success: 'false',
          error: 'Not Found',
          msg: 'Data Peserta tidak ada untuk quiz ini'
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
});

module.exports = router;
