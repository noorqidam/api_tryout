const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {BankSoal} = require('../../../models/mongoose/BankSoal');
const BankSoalCache = require('../../../cache/bankSoal')

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
    let auth = req.auth
    try {
      if (auth.role === 'ADMIN' || auth.role === 'STAF') {
        const GetInfoBankSoal = await BankSoal.findOne({ _id : _id});
        if (GetInfoBankSoal) {
          await BankSoal.updateOne({_id: _id}, {deleted: true}, err => {
            if(err){
              console.log(err)
              return res.status(500).json({
                success : 'false',
                message :err
              });
            } else {
  
              BankSoalCache.deleteCacheAll()
              return res.status(201).json({
                success : 'true',
                message :'Berhasil Hapus Bank Soal ',
                data :GetInfoBankSoal 
              });
            }
          })
          
        } else {
          return res.status(404).json({
            success : 'false',
            message :'Data Soal tidak Di Temukan'
          });
        }
      } else {
        const GetInfoBankSoal = await BankSoal.findOne({ _id : _id});
        if (GetInfoBankSoal) {
          if (GetInfoBankSoal.createdBy === auth.username) {
            await BankSoal.updateOne({_id: _id}, {deleted: true}, err => {
              if(err){
                console.log(err)
                return res.status(500).json({
                  success : 'false',
                  message :err
                });
              } else {
    
                BankSoalCache.deleteCacheAll()
                return res.status(201).json({
                  success : 'true',
                  message :'Berhasil Hapus Bank Soal ',
                  data :GetInfoBankSoal 
                });
              }
            })
          } else {
            return res.status(403).json({
              success : 'false',
              message :'UnAuthorized'
            });
          }
        } else {
          return res.status(404).json({
            success : 'false',
            message :'Data Soal tidak Di Temukan'
          });
        }
      }
     
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: 'false',
        error
      })
    }
  }
});

module.exports = router;