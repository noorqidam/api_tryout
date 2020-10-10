'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { SoalUjian  } = require('../../../models/mongoose/Soalujian');
/**
* Display the specified resource
*
* @param	String/int 	 id
*
*/

router.get('/:id',async (req, res) => {
  let id = req.params.id
  try {
    const GetSoalUjian = await SoalUjian.findById({ _id : id})
      .populate({ path :'ujian_id'})
      .sort({ id : -1})
      
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data : GetSoalUjian
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
 * Add Soal in Exist Soal Ujian
 */
router.post('/sub-soal',[
  check('_id').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    
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
    const GetSoalUjian = await SoalUjian.findOne({ _id:id});
    if (GetSoalUjian) {
      GetSoalUjian.soals.id(soal_id).remove();
      GetSoalUjian.save();
      return res.status(200).json({
        success : 'true',
        message :'Berhasil Delete'
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
    let id = req.body.sesi_ujian_id;
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
});


module.exports	=	router;