'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { SoalUjian  } = require('../../../models/mongoose/Soalujian');
const mongoose = require('mongoose')
/**
* Display the specified resource
*
* @param	String/int 	 id
* Detail sesi ujian
*/

router.get('/:id',async (req, res) => {
  let id = req.params.id
  let publisher = req.auth.accountkey;
  try {
    const GetSoalInSesiUjian = await SoalUjian.findOne({ _id : id})
      .populate({ path :'ujian_id'})
      .sort({ id : -1})
      
    return res.status(200).json({
      success : 'true',
      message :'Data Sesi Ujian Di Temukan',
      data :GetSoalInSesiUjian
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

/**
* Stored a newly created resource in storage.
*
* @request body of Object type
*/

router.post('/',[
  check('ujian_id').not().isEmpty().withMessage('require'),
  check('sesi_ujian').not().isEmpty().withMessage('require'),
  check('duration').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    
    try {
      let publisher = req.auth.accountkey;
      var id = mongoose.Types.ObjectId();
      const CreateUjian = new SoalUjian({
        _id: id,
        ujian_id : req.body.ujian_id,
        sesi_ujian: req.body.sesi_ujian,
        duration: req.body.duration,
        soals : req.body.soal
      });

      let info = await CreateUjian.save();

      return res.status(201).json({
        success : 'true',
        message :'Success Save',
        data : info
      });
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
});


/**
 * Add Soal in Exist Soal Ujian
 */
router.post('/sub-soal',[
  check('_id').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let publisher = req.auth.accountkey;
    try {
      let soal = req.body.soal;
      let id = req.body._id;
      const Ujian = await SoalUjian.findOne({ _id : id});
      soal.forEach(element => {
        Ujian.soals.push(element);
      });
      Ujian.save(function (err) {
        if (err) {
          console.log(err)
          return res.status(500).json({
            success : 'false',
            message :err
          });
        }
        else {
          return res.status(201).json({
            success : 'true',
            success : 'true',
            message :'Success Save',
          });
        }
        console.log('Success!');
      });

      
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
});

/**
* Remove the specified resource from storage.
* 
* @param  String  id
* @param  String Soalid
*/
router.post('/remove-soals',async (req, res) => {
  try {
    let id        = req.body.sesi_ujian_id;
    let soal_id   = req.body.soal_id;
    let publisher = req.auth.accountkey;
    const GetSoalinSesi = await SoalUjian.findOne({ _id:id});
    if (GetSoalinSesi) {
      GetSoalinSesi.soals.id(soal_id).remove();
      GetSoalinSesi.save();
      return res.status(200).json({
        success : 'true',
        message :'Berhasil Delete Soal di Sesi Ujian'
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
});


router.post('/sesiujian' ,async(req,res)=> {
  try {
    let id        = req.body.sesi_ujian_id;
    let publisher = req.auth.accountkey;
    const GetSesiUjian = await SoalUjian.findOne({ _id:id});
    if (GetSesiUjian) {
      let info = await GetSesiUjian.remove()
      return res.status(201).json({
        success : 'true',
        message :'Success remove Sesi',
        data :info
      });
    } else {
      return res.status(404).json({
        success : 'false',
        message :'Sesi Ujian Tidak Di Temukan'
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
})

module.exports	=	router;