const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {MySoalQuiz} = require('../../../models/mongoose/MySoalQuiz');
const {JawabQuiz} = require('../../../models/mongoose/JawabQuiz');

router.get('/', async (req, res) => {
  let auth = req.auth;
  try {
    const GetAllMyQuiz = await MySoalQuiz.find({user_id: auth.uid}).populate('quiz_id', '_id judul_quiz quiz_banner start_date times end_times').sort({'quiz_id': 1})
    if(GetAllMyQuiz.length){
        let data = []
        GetAllMyQuiz.forEach((element) => {
          data.push({
            email: element.email,
            user_id: element.user_id,
            quiz_id: element.quiz_id ? element.quiz_id._id  ? element.quiz_id._id : "-" : "-",
            judul_quiz: element.quiz_id ? element.quiz_id.judul_quiz  ? element.quiz_id.judul_quiz : "-" : "-",
            quiz_banner: element.quiz_id ? element.quiz_id.quiz_banner  ? element.quiz_id.quiz_banner : "-" : "-",
            start_date: element.quiz_id ? element.quiz_id.start_date  ? element.quiz_id.start_date : "-" : "-",
            times: element.quiz_id ? element.quiz_id.times  ? element.quiz_id.times : "-" : "-",
            end_times: element.quiz_id ? element.quiz_id.end_times  ? element.quiz_id.end_times : "-" : "-"
          })
        })
        return res.status(200).json({
          success: 'true',
          data: data
        })
    } else {
      return res.status(200).json({
        success: 'true',
        data: [],
        message: 'Tidak ada history quiz'
      })
    }
  } catch (error) {
    console.error(error);
    
    return res.status(500).json({
      success: 'false',
      error: error
    })
  }
});

router.get('/detail-quiz', [
  check('quiz_id').exists().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    console.error(err);
    return res.status(422).json({      
      success: 'false',
      err: err
    })
  } else {
    let auth = req.auth;
    try {
      const {quiz_id} = req.query;
      const GetQuiz = await MySoalQuiz.findOne({user_id: auth.uid, quiz_id: quiz_id}).populate('quiz_id', '_id judul_quiz quiz_banner start_date times end_times')
      if(GetQuiz){
        const GetQuizRating = await JawabQuiz.aggregate([
          {$match: {user_id:{$eq: auth.uid}, quiz_id:{$eq: GetQuiz.quiz_id._id}}},
          {"$group": {_id: {quiz_id: "$quiz_id"}, 'count': {$sum: 1}, "total_point": {"$sum": "$jawaban.point"}}}
        ])
        if (GetQuizRating.length) {
          return res.status(200).json({
            success: 'true',
            data: {
              email: GetQuiz.email,
              user_id: GetQuiz.user_id,
              quiz_id: GetQuiz.quiz_id._id,
              judul_quiz: GetQuiz.quiz_id.judul_quiz,
              quiz_banner: GetQuiz.quiz_id.quiz_banner,
              start_date: GetQuiz.quiz_id.start_date,
              times: GetQuiz.quiz_id.times,
              end_times: GetQuiz.quiz_id.end_times,
              result: {
                total_soal: GetQuiz.soals.length,
                total_jawab: GetQuizRating[0].count,
                total_point: GetQuizRating[0].total_point,
                score: parseFloat((GetQuizRating[0].total_point / GetQuiz.soals.length * 100).toFixed(2))
              }
            }
          })
        } else {
          return res.status(404).json({
            success: 'false',
            error: 'Not Found',
            message: 'Data jawaban not found'
          })
        }
      } else {
        return res.status(404).json({
          success: 'false',
          error: 'Not Found',
          message: 'Tidak ada history quiz'
        })
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: 'false',
        error: error
      })
    }
  }
});

module.exports = router;