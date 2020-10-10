const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Quiz } = require('../../../models/mongoose/Quiz');

router.get('/', async (req, res) => {
  let page = parseInt(req.query.page) || 1;
	let limit = parseInt(req.query.limit) || 100;
	let offset = (page * limit) - limit;
  try {
    const publisher = req.auth.accountkey
    const getDeletedQuiz = await Quiz.find({deleted: true, penyelenggara: publisher})
    .limit(limit)
    .skip(offset)
    .sort({deletedAt: -1});
    if (getDeletedQuiz.length > 0) {
      return res.status(200).json({
        success: 'true',
        data: getDeletedQuiz
      })
    } else {
      return res.status(404).json({
        success: 'false',
        error: 'Not Found',
        message: 'Trash quiz kosong'
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: 'false',
      error: error
    })
  }
});

router.post('/', [ check('quiz_id').exists().withMessage('required') ],
  async (req, res) => {
    const err = validationResult(req);
    if(!err.isEmpty()){
      return res.status(422).json({
        success: 'false',
        message: err
      })
    } else {
      const quiz_id = req.body.quiz_id;
      try {
        const publisher = req.auth.accountkey
        const getQuiz = await Quiz.findOne({_id: quiz_id, deleted: true, penyelenggara: publisher});
        if (getQuiz) {
          const unDeleteQuiz = new Quiz(getQuiz);
          unDeleteQuiz.deleted = false;
          unDeleteQuiz.restoredBy = req.auth.username;
          const info = await getQuiz.updateOne(unDeleteQuiz);
          return res.status(201).json({
            success: 'true',
            message: `Quiz dengan id = ${quiz_id} has been restored`,
            info: info
          })
        } else {
          return res.status(404).json({
            success: 'false',
            error: 'Not Found',
            message: `quiz dengan id = ${quiz_id} tidak ditemukan`
          })
        }

      } catch (error) {
        return res.status(500).json({
          success: 'false',
          error: error
        })
      }
    }
});

module.exports = router;