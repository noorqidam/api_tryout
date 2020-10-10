const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {Quiz} = require('./../../../models/mongoose/Quiz');
// const {TrashQuiz} = require('./../../../models/mongoose/TrashQuiz');
const DeleteImage = require('./../../../helpers/google_cloud_storage_delete')


router.post('/',[
  check('quiz_id').not().isEmpty().withMessage('required')
], async (req, res) => {
  const error = validationResult(req);
  if(!error.isEmpty()){
    return res.status(422).json({
      success: 'false',
      message: error
    });
  } else {
    const id = req.body.quiz_id;
    // const pathImage =  req.header.path || 'tryout/';
    try {
        const findQuiz = await Quiz.findOne({_id: id});
        if(findQuiz){
          const trashQuiz = new Quiz( findQuiz );
          trashQuiz.deleted = true
          trashQuiz.deletedAt = new Date();
          trashQuiz.deletedBy = req.auth.username;
          // await DeleteImage.deletefile(trashQuiz.quiz_banner || 'No Data', pathImage)
          const info = await findQuiz.updateOne(trashQuiz);
          return res.status(200).json({
            success: 'true',
            message: `Quiz with id = ${id} have been moved to trash`,
            info: info
          });
        } else {
          return res.status(404).json({
            success: 'false',
            error: 'Not Found',
            message: 'Quiz Not Found'
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
