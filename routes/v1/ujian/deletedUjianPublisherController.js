const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Ujian } = require('../../../models/mongoose/Ujian');

router.get('/', async (req, res) => {
  const publisher = req.auth.accountkey
	let page = parseInt(req.query.page) || 1;
	let limit = parseInt(req.query.limit) || 100;
	let offset = (page * limit) - limit;
  try {
    const getDeletedUjian = await Ujian.find({deleted: true, penyelenggara: publisher})
    .limit(limit)
    .skip(offset)
    .sort({deletedAt: -1});
    if (getDeletedUjian.length > 0) {
      return res.status(200).json({
        success: 'true',
        data: getDeletedUjian
      })
    } else {
      return res.status(404).json({
        success: 'false',
        error: 'Not Found',
        message: 'Trash Ujian kosong'
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: 'false',
      error: error
    })
  }
});

router.post('/', [ check('ujian_id').exists().withMessage('required') ],
  async (req, res) => {
    const err = validationResult(req);
    if(!err.isEmpty()){
      return res.status(422).json({
        success: 'false',
        message: err
      })
    } else {
      const publisher = req.auth.accountkey
      const ujian_id = req.body.ujian_id;
      try {
        const getUjian = await Ujian.findOne({_id: ujian_id, deleted: true, penyelenggara: publisher});
        if (getUjian) {
          const unDeleteUjian = new Ujian(getUjian);
          unDeleteUjian.deleted = false;
          unDeleteUjian.restoredBy = req.auth.username;
          const info = await getUjian.updateOne(unDeleteUjian);
          return res.status(201).json({
            success: 'true',
            message: `Ujian dengan id = ${ujian_id} has been restored`,
            info: info
          })
        } else {
          return res.status(404).json({
            success: 'false',
            error: 'Not Found',
            message: `Ujian dengan id = ${ujian_id} tidak ditemukan`
          })
        }

      } catch (error) {
        return res.status(500).json({
          success: 'false',
          error: error
        })
      }
    }
});

module.exports = router;