const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Quiz } = require('./../../../models/mongoose/Quiz')
const { SoalQuiz } = require('../../../models/mongoose/SoalQuiz');
const { MySoalQuiz } = require('./../../../models/mongoose/MySoalQuiz')
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
				console.log('getquiz success');
				
				const GetSoalQuiz = await SoalQuiz.findOne({ quiz_id: GetQuiz._id }).select('soals quiz_id')
				if (GetSoalQuiz) {					
					const totalSoal = GetSoalQuiz.soals.length
					const GetMySoalQuiz = await MySoalQuiz.findOne({ quiz_id: GetSoalQuiz.quiz_id, user_id: user_id })
					
					const RatingPeserta = await JawabQuiz.find({ quiz_id: quiz_id, user_id: user_id })
						.select('-_id -user_id -jawaban._id -quiz_id -email -photo')
						.populate('soal_id', 'soal_text -_id')
					
					// const profile = JSON.parse(JSON.stringify(GetMySoalQuiz.profile_id))
					let unAnsweredQuestions = [];
					let Benar = 0;
					let Salah = 0;
					let answeredQuestions = [];
					let score = 0;
					let lulus = 'Tidak Lulus';
					if (GetMySoalQuiz) {
						GetMySoalQuiz.soals.forEach(item => {
							if (item.answered === false) {
								unAnsweredQuestions.push(item)
							}
						})
						if (RatingPeserta.length) {
							RatingPeserta.forEach(element => {
								let info = element.jawaban;
								if (info.benar === true) {
										const jawaban = {
												soal_id: element.soal_id,
												jawaban: {
														Benar: 'Benar',
														Point: element.jawaban.point,
														jawaban: element.jawaban.jawaban_text
												}
										}
										answeredQuestions.push(jawaban)
										Benar++;
										score += parseFloat((info.point / totalSoal * 100).toFixed(2))
								} else {
									const jawaban = {
										soal_id: element.soal_id,
										jawaban: {
											Benar: 'Salah',
											Point: element.jawaban.point,
											jawaban: element.jawaban.jawaban_text
										}
									}
									answeredQuestions.push(jawaban)
									Salah++;
								}
							});
								if(score >= kkm){
									lulus = 'Lulus'
								}
							return res.status(200).json({
								success: 'true',
								data: {
									totalSoal: totalSoal,
									dijawab: (Benar + Salah),
									Benar: Benar,
									Score: score,
									Salah: Salah,
									Lulus: lulus,
									SoalTidakDiJawab: unAnsweredQuestions,
									SoalDiJawab: answeredQuestions
								}
							});
						} else {
							return res.status(200).json({
								success: 'true',
								data: {
									totalSoal: totalSoal,
									dijawab: (Benar + Salah),
									Benar: 0,
									Point: score,
									Salah: 0,
									Lulus: lulus,
									SoalTidakDiJawab: unAnsweredQuestions,
									SoalDiJawab: answeredQuestions
								}
							});
						}
					} else {
						return res.status(404).json({
							success: 'false',
							error: 'Not Found',
							message: 'User not found'
						})
					}
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