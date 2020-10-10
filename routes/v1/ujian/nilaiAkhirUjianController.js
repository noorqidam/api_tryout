const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { NilaiUjian } = require('../../../models/mongoose/NilaiUjian');
const { Ujian } = require('../../../models/mongoose/Ujian');
const { SoalUjian } = require('../../../models/mongoose/Soalujian');
const { Profile } = require('../../../models/mongoose/profile');
const { log } = require('debug');



router.post('/', [
  check('ujian_id').exists().withMessage('required'),
  check('sesi_id').exists().withMessage('required'),
  check('nilai_akhir').exists().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(422).json({
      success: 'false',
      error: err
    })
  } else {
    const {ujian_id, sesi_id, user_id, email, nilai_objective, nilai_esay, nilai_akhir, catatan} = req.body;
    try {
      const FindUjian = await Ujian.findOne( {_id: ujian_id, deleted: false });
      if (FindUjian) {
        const SesiUjian = await SoalUjian.findOne({ujian_id: ujian_id, _id: sesi_id});
        if (SesiUjian) {
          const GetProfile = await Profile.findOne({user_id: user_id});
          const cekNilai = await NilaiUjian.findOne({ujian_id: ujian_id, sesi_id: sesi_id, user_id: user_id});
          let Nilai = new NilaiUjian({
            ujian_id : ujian_id,
            sesi_id : sesi_id,
            profile_id: GetProfile ? GetProfile._id : '-',
            user_id: user_id,
            judul_ujian: FindUjian.judul_ujian,
            sesi_ujian: SoalUjian.sesi_ujian,
            school: GetProfile ? GetProfile.school : '-',
            kelas: GetProfile ? GetProfile.kelas : '-',
            sub_kelas: GetProfile ? GetProfile.sub_kelas : '-',
            photo: GetProfile ? GetProfile.photo : '-',
            name: GetProfile ? GetProfile.name : '-',
            email: email ? email : GetProfile ? GetProfile.email : '-',
            creadtedBy: req.auth.id,
            nilai_objective: nilai_objective,
            nilai_esay: nilai_esay,
            nilai_akhir: parseFloat(nilai_akhir),
            catatan: catatan
          })
          let info = '';
          if(cekNilai){
            Nilai._id = cekNilai._id
            const nilai = await cekNilai.updateOne(Nilai);
            info = nilai
          }else{
            const nilai = await Nilai.save();
            info = nilai
          }
          return res.status(201).json({
            success: 'true',
            message: 'Berhasil input nilai',
            data: info
          })
        } else {
          return res.status(404).json({
            success: 'false',
            error: 'Not Found',
            message: 'Sesi Ujian tidak ditemukan'
          })
        }
      } else {
        return res.status(404).json({
          success: 'false',
          error: 'Not Found',
          message: 'Ujian tidak ditemukan'
        })
      }
    } catch (error) {
      console.log(error);
      
      return res.status(500).json({
        success: 'false',
        error: error
      })
    }
  }
});

module.exports = router;
