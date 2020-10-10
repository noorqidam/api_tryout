const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {Quiz} = require('./../../../models/mongoose/Quiz');
const {TrashQuiz} = require('./../../../models/mongoose/TrashQuiz');

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
    const { quiz_id } = req.body;
    let penyelenggara = req.auth.accountkey
    try {
      const GetQuiz = await Quiz.findOne({_id: quiz_id , penyelenggara : penyelenggara});
      if(GetQuiz){
        const Trash = new Quiz(GetQuiz);
        // await Trash.save();
        // await Quiz.remove({_id: quiz_id});
        Trash.deleted = true;
        Trash.deletedAt = new Date();
        Trash.deletedBy = req.auth.username;
        const info = await GetQuiz.updateOne(Trash);
        return res.status(200).json({
          success: 'true',
          message: `Quiz with quiz_id = ${quiz_id} have been moved to trash`,
          info: info
        });
      } else {
        return res.status(404).json({
          success: 'false',
          message: 'Data Not Found'
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        message: error
      });
    }
  }
});

module.exports = router;
