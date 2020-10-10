'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
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
  let sort = req.query.by || 'DESC';
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  try {
   
    const SoalUjian = await SoalUjian.find()
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

  try {
    const GEtSoalUjian = await SoalUjian.find({ ujian_id : id})
      .populate({ path :'ujian_id'})
      
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :GEtSoalUjian
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
  check('sesi_ujian').not().isEmpty().withMessage('require')
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    
    try {

      let ujian_id = req.body.ujian_id;
      let sesi_ujian = req.body.sesi_ujian;
      let duration = req.body.duration;
      let soal = req.body.soal;
      const cek_soal = soal.filter(item => {
        return item.type_soal === 'PG' ? item.jawabans.length < 1 ? true : false : item.type_soal === 'ESAY' ?  item.jawabans.length < 1 ? false : true :true
      })
      
      if (cek_soal.length > 0) {
        return res.status(422).json({
          error: 'Unprocessable Entity',
          message: 'type_soal atau jawaban tidak valid, ada opsi jawaban soal PG yang kosong atau jawaban soal ESAY yang memiliki opsi'
        })
      } else {
        var id = mongoose.Types.ObjectId();
        const CreateUjian = new SoalUjian({
          _id: id,
          ujian_id : ujian_id,
          sesi_ujian: sesi_ujian,
          duration: duration,
          soals : soal
        });
  
        let info = await CreateUjian.save();
  
        return res.status(201).json({
          success : 'true',
          message :'Success Save',
          data : info
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


/**
 * Add Soal in Exist Soal Ujian
 */
router.post('/sub-soal',[
  check('ujian_id').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    
    try {
      let soal = req.body.soal;
      let id = req.body.ujian_id;
      const cek_soal = soal.filter(item => {
        return item.type_soal === 'PG' ? item.jawabans.length < 1 ? true : false : item.type_soal === 'ESAY' ?  item.jawabans.length < 1 ? false : true :true
      })
      const Ujian = await SoalUjian.findOne({ ujian_id : id});
      
      if (cek_soal.length > 0) {
        return res.status(422).json({
          error: 'Unprocessable Entity',
          message: 'type_soal atau jawaban tidak valid, ada opsi jawaban soal PG yang kosong atau jawaban soal ESAY yang memiliki opsi'
        })
      } else {
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
            console.log('Success!');
            return res.status(201).json({
              success : 'true',
              success : 'true',
              message :'Success Save',
            });
          }
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
    const SoalUjian = await SoalUjian.findOne({ ujian_id : id});
    SoalUjian.soals.id(soal_id).remove();
    SoalUjian.save(function (err) {
      if (err) return handleError(err);
      console.log('the subdocs were removed');
    });
    return res.status(201).json({
      success : 'true',
      message :'Success Delete',
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