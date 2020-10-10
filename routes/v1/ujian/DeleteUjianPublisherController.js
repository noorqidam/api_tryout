const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {Ujian} = require('./../../../models/mongoose/Ujian');
const {TrashUjian} = require('./../../../models/mongoose/TrashUjian');
// const DeleteImage = require('./../../../helpers/google_cloud_storage_delete')

router.post('/',[
  check('ujian_id').not().isEmpty().withMessage('required')
], async (req, res) => {
  const error = validationResult(req);
  if(!error.isEmpty()){
    return res.status(422).json({
      success: 'false',
      message: error
    });
  } else {
    //let auth = req.auth;
    const id = req.body.ujian_id;
    try {
      const findUjian = await Ujian.findOne({_id: id});
      if(findUjian){
        let dataUjian = {
          deleted: true,
          deletedAt : new Date(),
          deletedBy : req.auth.username
        }
        const info = await findUjian.updateOne(dataUjian)
        return res.status(200).json({
          success: 'true',
          message: `Ujian with id = ${id} have been moved to trash`,
          info: info
        });
      } else {
        return res.status(404).json({
          success: 'false',
          error: 'Not Found',
          message: 'Ujian Not Found'
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