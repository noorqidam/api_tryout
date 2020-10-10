'use strict'
const	express  	=	require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const { ReferalRegister } = require('../../../models/mongoose/ReferalRegister')
/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/',async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit =parseInt(req.query.limit) || 100;
    let offset = (page * limit) - limit;
    let sort = req.query.by || 'DESC';
    let ORDER = 'DESC';
    if (sort) {
      ORDER = sort.toUpperCase();  
    }
    try {
      const GetLinkRegisterReferal = await ReferalRegister.find()
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data : GetLinkRegisterReferal
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
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

/**
* Display the specified resource
*
* @param	String/int 	 id
*
*/

router.get('/:id',async (req, res) => {
  try {
    let id = req.params.id
    const GetLinkRegisterReferal = await ReferalRegister.findOne({_id : id})
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data : GetLinkRegisterReferal
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
* Stored a newly created resource in storage.
*
* @request body of Object type
*/

router.post('/',[
  check('referal_code').not().isEmpty().withMessage('code referal is required'),
  check('school').not().isEmpty().withMessage('required'),
  check('actived').not().isEmpty().withMessage('required')
],async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    return res.status(422).json({
      success: 'false',
      error: err
    })
  } else {
    try {
      let referal_code = req.body.referal_code
      let school = req.body.school
      let kelas = req.body.kelas
      let sub_kelas = req.body.sub_kelas
      let actived = req.body.actived

      const SaveReferal = new ReferalRegister({
        referal_code : referal_code,
        school: school,
        kelas:kelas,
        sub_kelas: sub_kelas,
        actived: actived
      })

      let infoSave = await SaveReferal.save()
      return res.status(201).json({
        success : 'true',
        message :'Success Save',
        data :infoSave
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
* Update the specified resource in storage.
*
* @param  int  id
* @return Response
*/

router.put('/:id',async (req, res) => {
  try {
    let id = req.params.id
    let code_referal = req.body.code_referal
    let school = req.body.school
    let kelas = req.body.kelas
    let sub_kelas = req.body.sub_kelas
    let data = {
      code_referal : code_referal,
      school: school,
      kelas:kelas,
      sub_kelas: sub_kelas,
      actived: actived
    }
    const Getreferal = await ReferalRegister.findOne({_id: id})

    if (Getreferal) {
      const InfoUpdate = await Getreferal.updateOne(data)
  
      return res.status(201).json({
        success : 'true',
        message :'Success Save',
        data : InfoUpdate
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


router.delete('/:id', async(req,res)=> {
  let id = req.params.id;
  try {
    const DeleteReferal =  await ReferalRegister.deleteOne({_id:id})
    return res.status(201).json({
      success : 'true',
      message :'Success ',
      data :'Delete ' + DeleteReferal
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
})

module.exports	=	router;