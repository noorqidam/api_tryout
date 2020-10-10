'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { Campaign  } = require('../../../models/mongoose/Campaign');


router.get('/', async (req, res) => {
    try {
      const result = await Campaign.find();
      if(result){
        if(result.length > 0){
          return res.status(200).json({
            success: 'true',
            data: result
          });
        }
        return res.status(200).json({
          success: 'true',
          msg: 'No campaign data available'
        });
      } 
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        msg: error
      })
    }
});

module.exports	=	router;