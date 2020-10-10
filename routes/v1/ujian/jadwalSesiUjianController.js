'use strict'
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Ujian } = require('../../../models/mongoose/Ujian');
const { JadwalSesiUjian } = require('../../../models/mongoose/JadwalSesiUjian')


router.get('/:ujian_id', async(req,res)=> {
  try {
    let ujian_id = req.params.ujian_id
    const GetJadwal = await JadwalSesiUjian.findOne({ ujian_id : ujian_id })
    const GetDetailUjian = await Ujian.findOne({_id : ujian_id})
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data : GetJadwal,
      ujian:GetDetailUjian
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
})
/**
 * @requires body
 *  ujian_id: { type: Schema.Types.ObjectId, ref: 'Ujian' },
    schedule:[
      sesi_id: { type: String , required: true },
      sesi_ujian: { type: String },
      position:{ type: Number , unique: true },
      start_time:{ type: String, required: true },
      duration: { type: String }
    ]
 */
router.post('/', [
  check('ujian_id').not().isEmpty().withMessage('require'),
], async(req, res)=> {
  
  const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array(), validate: false });
	} else {
    try {
      
      const ujian_id = req.body.ujian_id;
      let schedule = req.body.schedule;
      const GetUjian = await Ujian.findOne({ _id: ujian_id})
      if (GetUjian) {
        const SaveJadwal = await JadwalSesiUjian({
          ujian_id: GetUjian._id,
          schedule:schedule
        })

        let infoSave =  await SaveJadwal.save()

        return res.status(201).json({
          success : 'true',
          message :'Berhasil membuat Jadwal',
          data :infoSave
        });
      } else {
        return res.status(404).json({
          success : 'false',
          message :'Ujian Tidak Di Temukan'
        });
      }
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
})
module.exports = router;