const express = require('express');
const router = express.Router();
const { Quiz } = require('./../../../models/mongoose/Quiz');
const { StartQuiz } = require('./../../../models/mongoose/StartQuiz');

router.get('/:quiz_id', async (req, res) => {
  const {quiz_id} = req.params;
  try {
    const GetQuiz = await Quiz.findOne({_id: quiz_id, deleted: false});
    if (GetQuiz) {
      const GetNilaiPeserta = await StartQuiz.aggregate([
        { $match: { quiz_id: {$eq: GetQuiz._id }, show_nilai: { $eq: true } } },
        { $group: {
            _id: { user_id: '$user_id' },
            'quiz_id': {'$first': '$quiz_id'},
            'email': {'$first': '$email'},
            'start_time': {'$first': '$start_time'},
            'end_time': {'$first': '$end_time'},
            'nilai': {'$first': '$nilai'},
            'show_nilai': {'$first': '$show_nilai'}
          }
        },
        { $sort: { 'nilai': -1, 'end_time': 1 }}
      ])
      return res.status(200).json({
        success: 'true',
        quiz: GetQuiz,
        data: GetNilaiPeserta
      })
    } else {
      console.log('Quiz Not Found');
      return res.status(404).json({
        success: 'false',
        error: 'Not Found',
        message: 'Quiz tidak ditemukan'
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: 'false',
      error: error
    })
  }
});

module.exports = router;