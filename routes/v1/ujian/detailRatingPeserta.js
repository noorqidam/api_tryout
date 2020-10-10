const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Ujian } = require('./../../../models/mongoose/Ujian');
const { SoalUjian } = require('../../../models/mongoose/Soalujian');
const { JawabanUjian } = require('../../../models/mongoose/JawabanUjian');
const { MySoalUjian } = require('./../../../models/mongoose/MySoalUjian')

router.post('/', [
	check('ujian_id').not().isEmpty().withMessage('required'),
	check('sesi_id').not().isEmpty().withMessage('required'),
	check('user_id').exists().withMessage('required')
], async(req, res) => {
	const err = validationResult(req);
	if (!err.isEmpty()) {
		return res.status(422).json({
			success: 'false',
			error: err
		});
	} else {
		let ujianId = req.query.ujian_id
		let sesiId = req.body.sesi_id
		let user_id = req.body.user_id
		const kkm = req.body.kkm || 65;
		try {
			const getUjian = await Ujian.findOne({ _id: ujianId, deleted: false })
			if (getUjian) {
				const GetSoalUjian = await SoalUjian.findOne({ ujian_id: ujianId, _id: sesiId })
				if (GetSoalUjian) {
					// let unAnsweredQuestions = [];
					let Benar_pg = 0;
					let Salah_pg = 0;
					let answeredQuestions = [];
					let score_pg = 0;
					let score_esay = 0;
					let pg_dijawab = 0;
					let esay_dijawab = 0;
					let lulus = 'Tidak Lulus'
					const PesertaQuestion = await MySoalUjian.findOne({ ujian_id: GetSoalUjian.ujian_id, sesi_id: GetSoalUjian._id, user_id: user_id })
					const totalSoal = PesertaQuestion.soals.length
					let total_soal_esay = 0;
					let total_soal_pg = 0;
					
					if (PesertaQuestion) {
						const JawabanPeserta = await JawabanUjian.aggregate([
							{ $match: { ujian_id: { $eq: PesertaQuestion.ujian_id }, sesi_id: {$eq: PesertaQuestion.sesi_id}, user_id : PesertaQuestion.user_id} },
							{
								"$group" : { _id :{ "soal_id": "$soal_id" },
								"user_id": {"$first": "$user_id"},
								"name": {"$first": "$name"},
								"email": {"$first": "$email"},
								"school": {"$first": '$school'},
								"kelas": {"$first": '$kelas'},
								"sub_kelas": {"$first": '$subject'},
								"type_soal": {"$first": "$type_soal"},
								"jawaban": {"$first": "$jawaban"}
							}},
							{
								"$lookup":
									{
										"from": 'banksoals',
										let: {soalId: '$_id.soal_id'},
										"pipeline": [
											{ "$match": {$expr: { $eq:["$_id", "$$soalId"] }}},
											{ "$project": { "createdBy": 0,"bobot": 0, "createdAt": 0, "free_trial": 0, "publish": 0, "deleted": 0, "tag": 0, "jawabans": 0, "soal_image": 0 }}
										],     
										"as": "banksoal"
									}
							},
							{
								"$project": 
									{
										_id : 1,
										"user_id": 1,
										"name": 1,
										"email": 1,
										"school": 1,
										"kelas": 1,
										"sub_kelas": 1,
										"type_soal": 1,
										"jawaban": 1,
										"soal_id": { "$arrayElemAt": [ "$banksoal", 0 ] },
									}
							}
						])
						PesertaQuestion.soals.forEach(item =>{
							// if (item.answered === false) {
							// 	unAnsweredQuestions.push(item)
								if(item.type_soal === 'ESAY'){
									total_soal_esay += 1
								} else {
									total_soal_pg += 1
								}
							// } 
						}) 
						if (JawabanPeserta.length) {
							JawabanPeserta.forEach(element => {
								let info = element.jawaban;
								if(element.type_soal === 'PG') {
									pg_dijawab += 1;
									if (info.benar === true) {
										const jawaban = {
											soal_id: element.soal_id,
											jawaban: {
												benar: 'Benar',
												type_soal: 'PG',
												point: element.jawaban.point,
												jawaban: element.jawaban.jawaban_text
											}
										}
										answeredQuestions.push(jawaban)
										Benar_pg++;
										score_pg += element.jawaban.point;
									} else {
										const jawaban = {
											soal_id: element.soal_id,
											jawaban: {
												benar: 'Salah',
												type_soal: 'PG',
												point: element.jawaban.point,
												jawaban: element.jawaban.jawaban_text,
												jawaban_image: element.jawaban_image
											}
										}
										answeredQuestions.push(jawaban)
										Salah_pg++;
									}
								} else {
									esay_dijawab += 1;
									score_esay += info.point
									const jawaban = {
										soal_id: element.soal_id,
										jawaban: {
											type_soal: element.type_soal,
											point: element.jawaban.point,
											jawaban: element.jawaban.jawaban_text
										}
									}
									answeredQuestions.push(jawaban)
								}
							});
							return res.status(200).json({
								success: 'true',
								data: {
									email: PesertaQuestion.email,
									totalSoal: totalSoal,
									total_soal_pg: total_soal_pg,
									total_soal_esay: total_soal_esay,
									pg_dijawab: pg_dijawab,
									esay_dijawab: esay_dijawab,
									pg_Benar: Benar_pg,
									pg_Salah: Salah_pg,
									score_pg: parseFloat((score_pg / total_soal_pg * 100).toFixed(1)),
									score_esay: score_esay ? parseFloat((score_esay / (total_soal_esay*100) * 100).toFixed(1)) : 0,
									SoalDiJawab: answeredQuestions,
									// SoalTidakDiJawab: unAnsweredQuestions
								}
							});
						} else {
							return res.status(200).json({
								success: 'true',
								data: {
									totalSoal: totalSoal,
									pg_dijawab: 0,
									esay_dijawab: 0,
									pg_Benar: 0,
									score_pg: 0,
									score_esay: 0,
									pg_Salah: total_soal_pg,
									Lulus: lulus,
									SoalTidakDiJawab: unAnsweredQuestions,
									// SoalDiJawab: answeredQuestions
								}
							});
						}
					} else {
						return res.status(404).json({
							success: 'false',
							error: 'Not Found',
							msg: 'Rating is not exist'
						});
					}
				} else {
					return res.status(404).json({
						success: 'false',
						error: 'Not Found',
						msg: 'Sesi Ujian not found'
					});
				}
			} else {
				return res.status(404).json({
					success: 'false',
					error: 'Not Found',
					msg: 'Ujian is not exist'
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