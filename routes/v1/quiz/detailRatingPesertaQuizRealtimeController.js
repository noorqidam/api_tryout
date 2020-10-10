const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Quiz } = require('./../../../models/mongoose/Quiz')
const { SoalQuiz } = require('../../../models/mongoose/SoalQuiz');
const { JawabQuiz } = require('../../../models/mongoose/JawabQuiz');

router.post('/', [
	check('quiz_id').not().isEmpty().withMessage('required'),
	check('user_id').exists().withMessage('required')
], async(req, res) => {
	const err = validationResult(req);
	if (!err.isEmpty()) {
		return res.status(422).json({
			success: 'false',
			error: err
		});
	} else {
		let quiz_id = req.query.quiz_id
		let user_id = req.body.user_id
		let kkm = req.body.kkm || 65;
		try {
			const GetQuiz = await Quiz.findOne({ _id: quiz_id, deleted: false })
			if (GetQuiz) {
				
				const GetSoalQuiz = await SoalQuiz.findOne({ quiz_id: GetQuiz._id }).select('soals quiz_id')
				if (GetSoalQuiz) {
          const soal = GetSoalQuiz.soals;					
          const totalSoal = GetSoalQuiz.soals.length;
          let unAnsweredQuestions = [];
					let Benar = 0;
					let answeredQuestions = [];
					let score = 0;
					let lulus = false;
          const getJawaban = await JawabQuiz.aggregate([
            {$match: {quiz_id: { $eq: GetQuiz._id} , user_id: { $eq: user_id }}},
            {"$group": {
              _id: { soal_id: '$soal_id' },
              'profile_id': {'$first': '$profile_id'},
              'user_id': {'$first': '$user_id'},
              'email': {'$first': '$email'},
              'name': {'$first': '$name'},
              'school': {'$first': '$school'},
              'kelas': {'$first': '$kelas'},
              'sub_kelas': {'$first': '$sub_kelas'},
              'photo': {'$first': '$photo'},
              'soal_text': {'$first': '$soal_text'},
              'jawaban': {'$first': '$jawaban'},
              'type_soal': {'$first': '$type_soal'},
              'count': {'$sum': 1}
              }
            }
          ]).lookup({
            from: 'banksoals',
                  let: {soalId: '$_id.soal_id'},
                  pipeline: [
                    {$match: {$expr: { $eq: ['$_id', '$$soalId']}}},
                    {$project: {
                      'createdAt': 0,
                      'updatedAt':0
                    }}
                  ],
                  as: 'soals'
          }).sort('email');
          soal.forEach((item, index) => {
            const answeredFilter = getJawaban.filter(x => {
              const x_soal_id = JSON.parse(JSON.stringify(x._id.soal_id))
              const item_soal_id = JSON.parse(JSON.stringify(item._id))
              return x_soal_id ===  item_soal_id
            })
            if (answeredFilter.length > 0) {
              const answered = answeredFilter[0];
              answeredQuestions.push(answered);
              if (answered.jawaban.benar === true) {
                Benar += 1
                score += 1
              }
            } else {
              unAnsweredQuestions.push(item)
            }
            if (index === soal.length -1) {
              const nilai = parseFloat((score / totalSoal * 100).toFixed(2))
              if (nilai >= kkm) {
                lulus = true
              }
            }
          })
          return res.status(200).json({
            success: 'true',
            data: {
              nilai: parseFloat((score / totalSoal * 100).toFixed(2)),
              lulus: lulus,
              totalSoal: totalSoal,
              salah: totalSoal - Benar,
              benar: Benar,
              answered: answeredQuestions,
              unanswered: unAnsweredQuestions
            }
          })
				} else {
					return res.status(404).json({
						success: 'false',
						error: 'Not Found',
						message: 'Belum ada soal untuk quiz'
					})
				}
			} else {
				return res.status(404).json({
					success: 'false',
					error: 'Not Found',
					message: 'Quiz not found'
				});
			}
		} catch (error) {
			return res.status(500).json({
				success: 'false',
				error: error
			});
		}
	}
});

module.exports = router;