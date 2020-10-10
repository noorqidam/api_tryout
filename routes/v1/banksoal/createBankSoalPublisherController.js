'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { BankSoal  } = require('../../../models/mongoose/BankSoal');
const mongoose = require('mongoose');
const BankSoalCache = require('../../../cache/bankSoal')

router.post('/',
[
  check('category_id').not().isEmpty().withMessage('require'),
  check('matpel_id').not().isEmpty().withMessage('require'),
], 
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let auth = req.auth;
    const {soal_text, category_id, matpel_id, bobot, jawabans , publish , type_soal ,sub_category_id} = req.body;
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
        sub_category_id: sub_category_id,
        matpel_id: matpel_id,
        publisher_id: auth.accountkey,
        publish: publish,
        deleted: false,
        type_soal: type_soal,
        tag: category_id + ' ' + sub_category_id,
        bobot: bobot,
        jawabans: jawaban,
        createdBy: auth.username
      });
      BankSoalCache.deleteCacheAll()
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
  check('matpel_id').not().isEmpty().withMessage('require')
], async (req, res) => {
  const err = validationResult(req);
  if(err.isEmpty()){
    const {soal_text, category_id, matpel_id, bobot, jawabans , type_soal ,sub_category_id} = req.body;
    const {_id} = req.params;
    let auth = req.auth
    try {
      if (auth.role === 'ADMIN' || auth.role === 'STAF') {
        const getSoal = await BankSoal.findById({_id});
        const jawabanArray = jawabans
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
          soal_image: req.soalimage_name,
          category_id: category_id,
          sub_category_id: sub_category_id,
          matpel_id: matpel_id,
          type_soal: type_soal,
          tag: category_id + ' ' + sub_category_id,
          bobot: bobot,
          jawabans: jawaban
        }

        await getSoal.updateOne(updatedSoal)

        BankSoalCache.deleteCacheAll()
        return res.status(200).json({
          success: 'true',
          data: updatedSoal
        });
      } else {
        const getSoal = await BankSoal.findById({_id});
        if (getSoal.createdBy == auth.username) {
          const jawabanArray = jawabans
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
            soal_image: req.soalimage_name,
            category_id: category_id,
            sub_category_id: sub_category_id,
            matpel_id: matpel_id,
            type_soal: type_soal,
            tag: category_id + ' ' + sub_category_id,
            bobot: bobot,
            jawabans: jawaban
          }

          await getSoal.updateOne(updatedSoal)

          BankSoalCache.deleteCacheAll()
          return res.status(200).json({
            success: 'true',
            data: updatedSoal
          });
        } else {
          return res.status(403).json({
            success : 'false',
            message :'UnAuthorized'
          });
        }
        
      }
      
    } catch (error) {
      console.log(error)
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


/**
 * Upload Banksoal by xlsx
 */

 router.post('/upload',[
  check('category_id').not().isEmpty().withMessage('require')
 ], async(req,res)=> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    try {
      let auth = req.auth;
      const BankSoal = req.body.banksoal;
      const id = mongoose.Types.ObjectId();
      let Soals = [];
      BankSoal.forEach((e, index) => {
        Soals.push({
          soal_text: e.soal_text,
          soal_gambar: e.soal_gambar,
          type_soal: e.type_soal,
          category_id: e.category_id,
          matple_id: e.matple_id,
          jawaban: [
            { a: e.a },
            { benar_a: e.benar_a },
            { point_a: e.ponit_a },
            { b: e.b },
            { benar_b: e.benar_b },
            { point_b: e.point_b },
            { c: e.c },
            { benar_c: e.benar_c },
            { point_c: e.ponit_c },
            { d: e.d },
            { benar_d: e.benar_d },
            { point_d: e.point_d },
            { e: e.e },
            { benar_e: e.benar_e },
            { point_e: e.point_e }
          ]
        });
      });
      const soal = new BankSoal({
        _id: id,
        soal_text: soal_text,
        soal_image: req.soalimage_name,
        category_id: category_id,
        matpel_id: matpel_id,
        publisher_id: auth.accountkey,
        publish: publish,
        deleted: false,
        type_soal: type_soal,
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
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
})

module.exports	=	router;