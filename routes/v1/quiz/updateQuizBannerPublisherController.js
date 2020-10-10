const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {Quiz} = require('./../../../models/mongoose/Quiz');
const UploadImage = require('./../../../helpers/google_cloud_quiz_storage')

router.post('/',
  UploadImage.multer.single('quiz_banner'),
  UploadImage.sendUploadToGCS,
[
  check('quiz_id').not().isEmpty().withMessage('require')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let {quiz_id} = req.body;
    console.log(req.body)
    try {
      const GetQuiz = await Quiz.findOne({ _id : quiz_id, deleted: false })
      const UpdateQuiz = {
        quiz_banner: req.fileimage_name,
      } 
      if (GetQuiz) {
        let infoUpdate =  await GetQuiz.updateOne(UpdateQuiz);
        return res.status(201).json({
          success : 'true',
          message :'Success Update Quiz ' + quiz_id, 
          data :infoUpdate
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
  }
});

module.exports = router;