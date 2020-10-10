const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Ujian } = require('./../../../models/mongoose/Ujian')
const { SoalUjian } = require('../../../models/mongoose/Soalujian');
const { JawabanUjian } = require('../../../models/mongoose/JawabanUjian');
const { MySoalUjian } = require('../../../models/mongoose/MySoalUjian')
router.post('/', [
	check('ujian_id').not().isEmpty().withMessage('required')
], async(req, res) => {
	const err = validationResult(req);
	if (!err.isEmpty()) {
		return res.status(422).json({
			success: 'false',
			error: err
		});
	} else {
		let id = req.body.ujian_id;
		let result = [];
		try {
			const GetUjian = await Ujian.findOne({ _id: id, deleted: false });
			if (GetUjian) {
				const SesiUjian = await SoalUjian.find({ ujian_id: GetUjian._id }).select('soals ujian_id sesi_ujian');
				if (SesiUjian.length > 0) {
					const PesertaUjians = await MySoalUjian.aggregate([
						{
							$match:  {
								ujian_id: {$eq: GetUjian._id}
							} 
						},
						{
							"$group": {
								_id: {"user_id": "$user_id"},
								"ujian_id": {"$first": "$ujian_id"},
								"email": {"$first": "$email"},
								"sesi_id": {"$first": "$sesi_id"},
								"sesi_ujian": {"$first": "$sesi_ujian"}
							}
						}
					])
					SesiUjian.forEach(async(sesi, index) => {
						const TotalPesertaUjian = PesertaUjians.filter(peserta => {
							const peserta_sesi_id = JSON.parse(JSON.stringify(peserta.sesi_id))
							const sesi_id = JSON.parse(JSON.stringify(sesi._id))
							return  peserta_sesi_id === sesi_id
						});
						if (TotalPesertaUjian.length) {
							result.push({
								ujian_id: sesi.ujian_id,
								ujian_name: GetUjian.judul_ujian,
								sesi_ujian: sesi.sesi_ujian,
								sesi_id: sesi._id,
								peserta: {
									jumlahPeserta: TotalPesertaUjian.length
								}
							})
						} else {
							result.push({
								ujian_id: sesi.ujian_id,
								ujina_name: GetUjian.judul_ujian,
								sesi_ujian: sesi.sesi_ujian,
								sesi_id: sesi._id,
								peserta: {
									jumlahPeserta: 'Belum Ada'
								}
							})
						}
						if(index === SesiUjian.length -1) {
							return res.status(200).json({
								success: 'true',
								data: result
							})
						}
					})
				} else {
					return res.status(404).json({
						success: 'false',
						error: 'Not Found',
						msg: 'Sesi ujian does not exist'
					});
				}
			} else {
				return res.status(404).json({
					success: 'false',
					error: 'Not Found',
					msg: 'Ujian does not exist'
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