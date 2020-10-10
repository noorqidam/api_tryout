'use strict'
const express = require('express');
const router = express.Router();
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const db      = require('../../../models/index');
const { check, validationResult } = require('express-validator');
const { Ujian } = require('../../../models/mongoose/Ujian');
const { UjianAccess } = require('../../../models/mongoose/UjianAccess')
const mongoose = require('mongoose')
const UploadImage = require('../../../helpers/google_cloud_storage')
const moment = require('moment')

/**
 * Display a listing of the resource
 *
 * @return array of Object
 */

router.get('/', async(req, res) => {
	let page = parseInt(req.query.page) || 1;
	let limit = parseInt(req.query.limit) || 100;
	let offset = (page * limit) - limit;
	let sort = req.query.by || 'DESC';
	let ORDER = 'DESC';
	if (sort) {
			ORDER = sort.toUpperCase();
	}
	try {

		const CountUjian = await Ujian.countDocuments({ deleted: false })
		const DataUjian = await Ujian.find({ deleted: false })
			.limit(limit)
			.skip(offset)
			.sort({ id: -1 });

		return res.status(201).json({
				success: 'true',
				message: 'Success',
				data: DataUjian,
				count: CountUjian
		});

	} catch (error) {
			console.log(error)
			return res.status(500).json({
					success: 'false',
					message: error
			});
	}
});

router.get('/search', async (req, res) => {
	let page = parseInt(req.query.page) || 1;
	let limit = parseInt(req.query.limit) || 100;
	let offset = (page * limit) - limit;
	const judul = new RegExp(req.query.judul);
	
	try {
		console.log('success');
		const SearchUjian = await Ujian.find({ 
			judul_ujian: { $regex: judul, $options: 'i'}, 
			deleted: false
		}).skip(offset).limit(limit)
		return res.status(200).json({
			success: 'true',
			data: SearchUjian
		})
	} catch (error) {
		return res.status(500).json({
			success: 'false',
			message: error
		})
	}
});

router.get('/filter', async (req, res) => {
	let page = parseInt(req.query.page) || 1;
	let limit = parseInt(req.query.limit) || 100;
	let offset = (page * limit) - limit;
	const penyelenggara = req.query.penyelenggara;
	const type = req.query.type;
	const is_premium = req.query.is_premium;
	const category = req.query.category;
	let query = {};
	if(penyelenggara){
		query.penyelenggara = penyelenggara
	}
	if(type){
		query.type_ujian = type
	}
	if(is_premium){
		query.is_premium = is_premium
	}
	if(category){
		query.category = category
	}
	try {
		const SearchUjian = await Ujian.find( query ).skip(offset).limit(limit)
		return res.status(200).json({
			success: 'true',
			data: SearchUjian
		})
	} catch (error) {
		return res.status(500).json({
			success: 'false',
			message: error
		})
	}
});

/**
 * Display the specified resource
 *
 * @param	String/int 	 id
 *
 */

router.get('/:id', async(req, res) => {
	let id = req.params.id
	try {
		const GetUjian = await Ujian.findOne({ _id: id, deleted: false })
		const GetUjianAccess = await UjianAccess.findOne({ ujian_id: GetUjian._id })
		return res.status(200).json({
				success: 'true',
				message: 'Data Ujian Di Temukan',
				data: GetUjian,
				ujian_access: GetUjianAccess
		});

	} catch (error) {
		console.log(error);
		return res.status(500).json({
				success: 'false',
				message: error
		});
	}
});

/**
 * Stored a newly created resource in storage.
 *
 * @request body of Object type
 */

router.post('/',
	UploadImage.multer.single('ujian_banner'),
	UploadImage.sendUploadToGCS, [
		check('judul_ujian').not().isEmpty().withMessage('require'),
		check('penyelenggara').not().isEmpty().withMessage('require'),
		check('type_ujian').not().isEmpty().withMessage('require'),
		check('category_ujian').not().isEmpty().withMessage('require'),
		check('times').not().isEmpty().withMessage('require'),
		check('end_times').not().isEmpty().withMessage('require'),
		check('publish').not().isEmpty().withMessage('require'),
		check('is_private').not().isEmpty().withMessage('require'),
	],
async(req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array(), validate: false });
	} else {
		try {
			let auth = req.auth
			let start_date = req.body.start_date ? req.body.start_date : moment().add('days', 1)
			let end_date = req.body.end_date ? req.body.end_date : moment().add('days', 1)
			let durasitampilPerSoal = req.body.durasi_soal ? req.body.durasi_soal : 120
			let is_premium = req.body.is_premium
			let is_private = req.body.is_private
			var id = mongoose.Types.ObjectId();

			const CreateUjian = new Ujian({
				_id: id,
				judul_ujian: req.body.judul_ujian,
				ujian_slug: req.body.ujian_slug,
				ujian_banner: req.fileimage_name,
				type_ujian: req.body.type_ujian,
				is_premium: req.body.is_premium ? req.body.is_premium : false,
				publish: req.body.publish ? req.body.publish : false,
				category_ujian: req.body.category_ujian,
				penyelenggara: req.body.penyelenggara,
				start_date: moment(start_date).format('YYYY-MM-DD'),
				times: req.body.times,
				end_times: req.body.end_times,
				durations: req.body.durations,
				end_date: moment(end_date).format('YYYY-MM-DD'),
				is_private: req.body.is_private ? req.body.is_private : false,
				type_start: req.body.type_start,
				durasi_soal: parseInt(durasitampilPerSoal),
				waktu_pengerjaan: req.body.waktu_pengerjaan,
				price: is_premium ? req.body.price : 0,
				metode_penilaian: req.body.metode_penilaian,
				description: req.body.description,
				createdBy : auth.username
			});

			if (is_private === true || is_private ==='true') {
        const CreateAccesUjian = new UjianAccess({
          ujian_id : id,
          acces_pin: req.body.pin,
        })
        let savePin = await CreateAccesUjian.save()
        let info = await CreateUjian.save();
        return res.status(201).json({
          success : 'true',
          message :'Success Save',
          data : info,
          pin: savePin
        });
      } else {
        let info = await CreateUjian.save();
        return res.status(201).json({
          success : 'true',
          message :'Success Save',
          data : info
        });
      }
		

		} catch (error) {
				console.log(error)
				return res.status(500).json({
						success: 'false',
						message: error
				});
		}
	}
});

/**
 * Update the specified resource in storage.
 *
 * @param  int  id
 * @return Response
 */

router.put('/:id', [
	check('id').not().isEmpty().withMessage('require'),
	check('judul_ujian').not().isEmpty().withMessage('require'),
	check('penyelenggara').not().isEmpty().withMessage('require'),
	check('type_ujian').not().isEmpty().withMessage('require'),
	check('category_ujian').not().isEmpty().withMessage('require'),
	check('times').not().isEmpty().withMessage('require'),
	check('end_times').not().isEmpty().withMessage('require'),
	check('publish').not().isEmpty().withMessage('require'),
	check('is_private').not().isEmpty().withMessage('require'),
], async(req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
	} else {

		let id = req.params.id;
		console.log(req.body)
		try {

			let start_date = req.body.start_date ? req.body.start_date : moment().add('days', 1)
			let end_date = req.body.end_date ? req.body.end_date : moment().add('days', 1)
			let durasitampilPerSoal = req.body.durasi_soal ? req.body.durasi_soal : 120
			let is_premium = req.body.is_premium
			let is_private = req.body.is_private
			const GetUjian = await Ujian.findById({ _id: id })

			const UpdatedUjian = {
					judul_ujian: req.body.judul_ujian,
					ujian_slug: req.body.ujian_slug,
					ujian_banner: req.body.ujian_banner,
					type_ujian: req.body.type_ujian,
					is_premium: req.body.is_premium ? req.body.is_premium : false,
					publish: req.body.publish ? req.body.publish : false,
					category_ujian: req.body.category_ujian,
					penyelenggara: req.body.penyelenggara,
					start_date: moment(start_date).format('YYYY-MM-DD'),
					times: req.body.times,
					end_times: req.body.end_times,
					durations: req.body.durations,
					end_date: moment(end_date).format('YYYY-MM-DD'),
					is_private: req.body.is_private ? req.body.is_private : false,
					type_start: req.body.type_start,
					durasi_soal: parseInt(durasitampilPerSoal),
					waktu_pengerjaan: req.body.waktu_pengerjaan,
					price: is_premium ? req.body.price : 0,
					metode_penilaian: req.body.metode_penilaian,
					description: req.body.description,
					createdBy: req.auth.username
			}

			if (is_private === true || is_private === 'true') {
				console.log('Private Ujian ')
				const GetAccessUjian = await UjianAccess.findOne({ ujian_id: GetUjian._id })

				if (GetAccessUjian) {
					let PinUpdate = await GetAccessUjian.updateOne({
							acces_pin: req.body.pin
					})
					let infoUpdate = await GetUjian.updateOne(UpdatedUjian);
					return res.status(201).json({
							success: 'true',
							message: 'Success Add',
							data: infoUpdate,
							pin: PinUpdate
					});
				} else {
					const CreateAccesUjian = new UjianAccess({
							ujian_id: id,
							acces_pin: req.body.pin,
					})
					CreateAccesUjian.save()
					let infoUpdate = await GetUjian.updateOne(UpdatedUjian);
					return res.status(201).json({
							success: 'true',
							message: 'Success Add',
							data: infoUpdate
					});
				}

			} else {
					console.log('Non Private Ujian ')
					let infoUpdate = await GetUjian.updateOne(UpdatedUjian);
					return res.status(201).json({
							success: 'true',
							message: 'Success Add',
							data: infoUpdate
					});
			}

		} catch (error) {
			console.log(error)
			return res.status(500).json({
					success: 'false',
					message: error
			});
		}
	}
});



module.exports = router;