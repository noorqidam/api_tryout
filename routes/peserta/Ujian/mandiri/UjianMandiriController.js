'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { Ujian  } = require('../../../../models/mongoose/Ujian');
const moment = require('moment')

/**
* Display the specified resource
*
* @param	String/int 	 id
*
*/

router.get('/:id',async (req, res) => {
  let id = req.params.id
  try {
    //const utbk_banksoal = await Ujian.findById(id).populate({ path :'soals'})
    const GetUjian = await Ujian.findById(id) .where({ deleted : false })
    
    if (GetUjian) {
      
      let startButton = false;
      let expireButton = false;
      let countDowntimmer = false
      const getStartDate = moment(GetUjian.start_date).format('YYYY-MM-DD')
      const getEndDate = moment(GetUjian.end_date).format('YYYY-MM-DD')
      const CurrentDate = new Date()

      /** */
      if (moment(CurrentDate).isBetween(getStartDate,getEndDate)) {
        startButton = true
      } else if(moment().isBefore(getStartDate)){
        countDowntimmer = true
      } else {
        expireButton = true
      }

      return res.status(200).json({
        success : 'true',
        message :' Ujian'+ id +' Di Temukan',
        data :GetUjian,
        start_ujian: startButton,
        current_times: new Date(),
        start_time :getStartDate,
        end_times: new Date(getEndDate),
        countDowntimmer: countDowntimmer,
        expireButton: expireButton
      });

    } else {
      return res.status(200).json({
        success : 'false',
        message :'Ujian '+ id +' tidak di Temukan',
        data :GetUjian,
        sesi_ujian: []
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

module.exports	=	router;