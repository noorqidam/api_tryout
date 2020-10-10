'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { Ujian } = require('../../../models/mongoose/Ujian')
const { SoalUjian  } = require('../../../models/mongoose/Soalujian');
const mongoose = require('mongoose')

/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/',async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 1;
  let offset = (page * limit) - limit;
  let publisher = req.auth.accountkey;
  let sort = req.query.by || 'DESC';
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  try {
   
    const SoalUjian = await SoalUjian.find({
      penyelenggara:{ $eq:publisher}
    })
      .populate({ path :'ujian_id'})
      .limit(limit)
      .skip(offset)
      .sort({ id : -1})
      
    return res.status(201).json({
      success : 'true',
      message :'Success',
      data :SoalUjian
    });
   
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

/**
* Display the specified resource
*
* @param	String/int 	 id
*
*/

router.get('/ujian/:id',async (req, res) => {
  let id = req.params.id
  let publisher = req.auth.accountkey;
  try {

    const GetUjian = await Ujian.findOne({ _id : id})
    if (GetUjian) {
      const GetSoalUjian = await SoalUjian.find({ 
        ujian_id : { $eq:id}
      })
        .populate({ path :'ujian_id'})
        
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data :GetSoalUjian,
        ujian: GetUjian
      });
    } else {
      return res.status(404).json({
        success : 'false',
        message :'Data Tidak Di Temukan'
      });
    }
    
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
  check('sesi_ujian').not().isEmpty().withMessage('require')
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let publisher = req.auth.accountkey;
    try {

      var id = mongoose.Types.ObjectId();
      const StoreSoalUjianPublisher = new SoalUjian({
        _id: id,
        ujian_id : req.body.ujian_id,
        sesi_ujian: req.body.sesi_ujian,
        soals : req.body.soal
      });

      let info = await StoreSoalUjianPublisher.save();

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
  check('ujian_id').not().isEmpty().withMessage('require'),
  check('soal').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    
    try {
      let soal = req.body.soal;
      let id = req.body.sesi_id;
      const Ujian = await SoalUjian.findOne({ _id : id});
      console.log(Ujian)
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
            message :'Berhasil Menambahkan Soal ' + id,
          });
        }
        
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
router.delete('/:id/soal_id/:soalid',async (req, res) => {
  try {

    let id        = req.params.id;
    let soal_id   = req.params.soalid;
    SoalUjian.soals.id(soal_id).remove();
    SoalUjian.save(function (err) {
      if (err) return handleError(err);
      console.log('the subdocs were removed');
    });
    return res.status(201).json({
      success : 'true',
      message :'Berhasil Delete Soal di sesi Ujian',
      data :SoalUjian
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});


module.exports	=	router;