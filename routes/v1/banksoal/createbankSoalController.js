'use strict'
const	express  	=	require('express');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { BankSoal  } = require('../../../models/mongoose/BankSoal');
const mongoose = require('mongoose');

router.post('/',
  //UploadImage.multer.fields([{name: 'jawaban_image1', maxCount: 1},{name: 'jawaban_image2', maxCount: 1},{name: 'jawaban_image3', maxCount: 1},{name: 'jawaban_image4', maxCount: 1},{name: 'jawaban_image5', maxCount: 1},{name: 'image', maxCount: 1}]),
  //UploadImage.sendUploadToGCS, 
[
  check('category_id').not().isEmpty().withMessage('require'),
  check('matpel_id').not().isEmpty().withMessage('require'),
  check('publisher_id').not().isEmpty().withMessage('require')
], 
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    const {soal_text, category_id, matpel_id, publisher_id, bobot, jawabans ,publish } = req.body;
    let auth = req.auth
    try {
      const id = mongoose.Types.ObjectId();
      const jawabanArray = JSON.parse(jawabans);
      //const jawaban_image = await req.jawaban_images;
      let jawaban = [];
      jawabanArray.forEach((element, index) => {
        jawaban.push({
          soal_id: id,
          jawaban_text: element.jawaban_text,
          // jawaban_image: jawaban_image[index], 
          benar: element.benar,
          point: element.point
        });
      });
      const soal = new BankSoal({
        _id: id,
        soal_text: soal_text,
        soal_image: req.soalimage_name,
        category_id: category_id,
        matpel_id: matpel_id,
        publisher_id: publisher_id,
        publish: publish,
        deleted: false,
        bobot: bobot,
        jawabans: jawaban,
        createdBy: auth.username
      });
      let result = await soal.save();
      return res.status(200).json({
        success: 'true',
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        msg: error
      })
    }
  }
});

/**
* Update the specified resource in storage.
*
* @param  int  id
* @return Response
*/

router.put('/:_id',
 [
  check('category_id').not().isEmpty().withMessage('require'),
  check('matpel_id').not().isEmpty().withMessage('require'),
  check('publisher_id').not().isEmpty().withMessage('require')
], async (req, res) => {
  const err = validationResult(req);
  if(err.isEmpty()){
    const {soal_text, category_id, matpel_id, publisher_id, jawabans, bobot, publish, deleted} = req.body;
    const {_id } = req.params;
    let auth = req.auth
    try {
      const getSoal = await BankSoal.findById({_id});
      const jawabanArray = JSON.parse(jawabans)
      
      if (getSoal) {
        let jawaban = [];
        jawabanArray.forEach((element, index) => {
          jawaban.push({
            jawaban_text: element.jawaban_text,
            benar: element.benar,
            point: element.point
          });
        })
        const updatedSoal = {
          soal_text: soal_text,
          category_id: category_id,
          matpel_id: matpel_id,
          publisher_id: publisher_id,
          publish: publish,
          bobot: bobot,
          jawabans: jawaban,
          createdBy: auth.username
        }
        const updateBankSoal = await getSoal.updateOne(updatedSoal)
        return res.status(200).json({
          success: 'true',
          data:  updateBankSoal
        });
      } else {
        return res.status(404).json({
          success : 'false',
          message :'Data Tidak Di Temukan'
        });
      }
      
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        msg: error
      });
    }
  } else {
    return res.status(422).json({
      errors: err.array()
    });
  }
});

module.exports	=	router;