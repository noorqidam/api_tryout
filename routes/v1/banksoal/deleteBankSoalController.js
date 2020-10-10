const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {BankSoal} = require('../../../models/mongoose/BankSoal');

/**
* Remove the specified resource from storage.
*
* @param _id
*/
router.post('/', [
  check('_id').not().isEmpty().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    return res.status(422).json({
      success: 'false',
      error: err
    });
  } else{
    let {_id} = req.body;
    try {
      await BankSoal.updateOne({_id: _id}, {deleted: true}, err => {
        if(err){
          res.status(400).json({
            success: 'false',
            error: err
          });
        } else {
          res.status(201).json({
            success: 'true',
            msg: 'deleted'
          });
        }
      })
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        error
      })
    }
  }
});

module.exports = router;