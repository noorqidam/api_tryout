'use strict'
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Ujian } = require('../../../models/mongoose/Ujian');
const { JadwalSesiUjian } = require('../../../models/mongoose/JadwalSesiUjian')

router.post('/', [
  check('ujian_id').not().isEmpty().withMessage('require'),
], async(req, res)=> {
  
  const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array(), validate: false });
	} else {
    try {
      
      const ujian_id = req.body.ujian_id;
      
      const GetUjian = await Ujian.findOne({ _id: ujian_id, deleted: false })
      if (GetUjian) {
        const DeleteJadwal = await JadwalSesiUjian.deleteOne({ ujian_id : GetUjian._id})
        return res.status(201).json({
          success : 'true',
          message :'Berhasil membuat Jadwal',
          data : DeleteJadwal
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