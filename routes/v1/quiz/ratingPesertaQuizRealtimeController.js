const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Quiz } = require('../../../models/mongoose/Quiz');
const { MySoalQuiz } = require('./../../../models/mongoose/MySoalQuiz')
const { SoalQuiz } = require('./../../../models/mongoose/SoalQuiz')
const { JawabQuiz } = require('../../../models/mongoose/JawabQuiz');

router.post('/', [
	check('quiz_id').not().isEmpty().withMessage('required')
], async(req, res) => {
	const err = validationResult(req);
	if (!err.isEmpty()) {
		return res.status(422).json({
			success: 'false',
			error: err
		});
	} else {
		const quizId = req.body.quiz_id;
		const kkm = req.body.kkm || 65;
		let data = [];
		try {
			const GetQuiz = await Quiz.findOne({ _id: quizId, deleted: false })
			if (GetQuiz) {
				const GetSoalQuiz = await SoalQuiz.findOne({ quiz_id: quizId })
				if(GetSoalQuiz){
          
					const scorePeserta = await JawabQuiz.aggregate([
						{ $match: { quiz_id: { $eq: GetQuiz._id } } },
						{ 
							"$group": {
								_id: { user_id: "$user_id" },
								'name':{'$first': '$name'},
								'email':{'$first': '$email'},
								'school': {'$first': '$school'},
								'kelas': {'$first': '$kelas'},
								'sub_kelas': {'$first': '$sub_kelas'},
								'count': { $sum: 1 },
								"total_point": { "$sum": "$jawaban.point" } } 
						}
					])
					
					const totalSoal = GetSoalQuiz.soals.length
					let lulus = 0;
          let tidakLulus = 0;
          if (scorePeserta.length > 0) {
            scorePeserta.forEach(item => {
						  const score = item.total_point / totalSoal * 100;
              if (score >= kkm ) {
                lulus += 1;
              } else {
                tidakLulus += 1;
              }
              data.push({
                email: item.email,
                user_id: item._id.user_id,
                name: item.name || item.email,
                nama_sekolah: item.school || '-',
                kelas: item.kelas || '-',
                sub_kelas: item.sub_kelas || '-',
                totalSoal: totalSoal,
								answered: item.count || 0,
								jawaban_benar: item.total_point,
								jawaban_salah: totalSoal - item.total_point,
                score: (item.total_point / totalSoal * 100).toFixed(2) || 0
              })

            })
            data.sort((a, b) => 
						(a.name.toUpperCase() < b.name.toUpperCase()) ? 
						-1 : 
						(a.name.toUpperCase() > b.name.toUpperCase()) ? 
						1 : 0
						)
						return res.status(200).json({
							success: 'true',
							Quiz: GetQuiz,
							data: {
								peserta: scorePeserta.length,
								lulus: lulus,
								tidakLulus: tidakLulus,
								ratingNilai: data
							}
						})
          } else {
            return res.status(404).json({
              success: 'false',
              error: 'Not Found',
              message: 'Tidak ada data jawaban untuk quiz realtime ini'
            })
          }
				} else {
					return res.status(404).json({
						success: 'false',
						error: 'Not Found',
						message: 'Soal Quiz not found'
					})
				}
			} else {
				return res.status(404).json({
					success: 'false',
					error: 'Not Found',
					message: 'Quiz Not Found'
				});
			}
		} catch (error) {
			console.log(error)
			return res.status(500).json({
				success: 'false',
				error: error
			});
		}
	}
});

module.exports = router;