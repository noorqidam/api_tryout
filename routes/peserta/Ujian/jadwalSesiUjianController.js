'use strict'
const express = require('express');
const router = express.Router();
const { JadwalSesiUjian } = require('../../../models/mongoose/JadwalSesiUjian')
const { mongoose } = require('mongoose')
/**
 * Get Timeline Ujian 
 * menampilkan time ujian dan urutan sesi
 */
router.get('/:ujian_id', async(req,res)=> {
  try {
    let ujian_id = req.params.ujian_id
    const GetJadwal = await JadwalSesiUjian.findOne({ ujian_id : ujian_id })
    if (GetJadwal) {
      return res.status(200).json({
        success : 'true',
        message :'Timeline Ujian ' + ujian_id,
        data : GetJadwal
      });
    } else {
     return res.status(404).json({
       success : 'false',
       message :'Data Tidak Di Temukan'
     }); 
    }
   
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
})
module.exports = router;