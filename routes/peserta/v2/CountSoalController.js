'use strict'
const	express  	=	require('express');
const { ModuleSoal } = require('../../../models/mongoose/ModuleSoal')
const { param, validationResult } = require('express-validator');
const	router 		= 	express.Router();
const CountModuleSoalCache = require('../../../cache/CountModuleSoal')

/**
* Display the specified resource
*
* @param	String/int 	 ids
*
*/

router.get('/:moduleid/paket-soal/:paketid',CountModuleSoalCache.getCache,[
  param('moduleid').not().isEmpty().withMessage('Module id is required'),
  param('paketid').not().isEmpty().withMessage('Paket Soal id is required')
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).json({ errors: errors.array() ,validate : false });
  } else {

    try {
      let module_id = req.params.moduleid;
      let paket_soal_id = req.params.paketid
      const GetSoal = await ModuleSoal.countDocuments({
        module_id: module_id,
        paket_soal_id: paket_soal_id
      });

      let Cachekey = req.baseUrl + req.url;
      CountModuleSoalCache.setCache(Cachekey,GetSoal)
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data : GetSoal
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

module.exports	=	router;