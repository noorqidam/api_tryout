const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {Ujian} = require('./../../../models/mongoose/Ujian');
const UploadImage = require('./../../../helpers/google_cloud_storage');

router.post('/',
  UploadImage.multer.single('ujian_banner'),
  UploadImage.sendUploadToGCS,
[
  check('ujian_id').not().isEmpty().withMessage('require'),
  check('judul_ujian').not().isEmpty().withMessage('require')
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    console.log(req.body)
    let ujian_id = req.body.ujian_id;
    try {
      const GetUjian = await Ujian.findOne({ _id : ujian_id, deleted: false });
      const UpdatedUjian = {
        ujian_banner:  req.fileimage_name
      } 
      if(GetUjian){
        let infoUpdate =  await GetUjian.updateOne(UpdatedUjian);
        return res.status(201).json({
          success : 'true',
          message :'Success Update Ujian ',
          data :infoUpdate
        });
      } else {
        return res.status(404).json({
          success: 'false',
          message: 'Data Tidak di Temukan'
        })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
});

module.exports = router;