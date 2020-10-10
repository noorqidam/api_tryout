'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { Campaign  } = require('../../../models/mongoose/Campaign');
const mongoose = require('mongoose');


router.post('/',
[
  check('campaign_title').not().isEmpty().withMessage('require'),
  check('position').not().isEmpty().withMessage('require'),
  check('link').not().isEmpty().withMessage('require'),
  check('publish').not().isEmpty().withMessage('require')
], 
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    const {campaign_title, position, link, campaign_banner, publish} = req.body;
    try {
      const id = mongoose.Types.ObjectId();
      const campaign = new Campaign({
        _id: id,
        campaign_title: campaign_title,
        campaign_banner: campaign_banner,
        position: position,
        link: link,
        publish: publish,
        deleted: false,
      });
      let result = await campaign.save();
      if(result){
        return res.status(200).json({
          success: 'true',
          data: result
        });
      }
      return res.status(400).json({
        success: 'false',
        msg: 'Data is not saved, campaign title already exist'
      });
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        msg: error
      })
    }
  }
});

module.exports	=	router;