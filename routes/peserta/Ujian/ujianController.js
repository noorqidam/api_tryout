'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { Ujian  } = require('../../../models/mongoose/Ujian');
const { SoalUjian } = require('../../../models/mongoose/Soalujian')
const UjianCache = require('../../../cache/ujianCache')
const moment = require('moment')
/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/',async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 100;
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'DESC';
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  try {
   
    const  GetUjian = await Ujian.find({ publish : true ,deleted: false})
      .limit(limit)
      .skip(offset)
      .sort({ id : -1});
    
    const url =  req.baseUrl + req.url;
    UjianCache.setCache(url,GetUjian)
    if ( GetUjian.length> 0) {
      return res.status(200).json({
        success : 'true',
        message :'Ujian Di Temukan',
        data : GetUjian
      });
    } else {
      return res.status(200).json({
        success : 'true',
        message :'Ujian tidak di temukan',
        data : GetUjian
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
  let id = req.params.id
  try {
    //const utbk_banksoal = await Ujian.findById(id).populate({ path :'soals'})
    const GetUjian = await Ujian.findById(id) 
      .where({ publish : true })
    
    if (GetUjian) {
      //console.log(GetUjian)
      const GetSesiUjian = await SoalUjian.find({ ujian_id : GetUjian._id },'ujian_id sesi_ujian duration soals._id')
      let startButton = false;
      let expireButton = false;
      let countDowntimmer = false
      const getDate = moment(GetUjian.start_date).format('YYYY-MM-DD')
      const getEndDate = moment(GetUjian.end_date).format('YYYY-MM-DD')
      const Hour = GetUjian.times
      const MaxHour = GetUjian.end_times
      const getHour = Hour.substring(0, 2)
      const getMinutes = Hour.substring(3, 5)
      const getMaxHours = MaxHour.substring(0, 2)
      const getMaxMinutes = MaxHour.substring(3, 5)

      const FullDateTime = moment(getDate).add(getHour, 'h').add(getMinutes, 'm')
      const EndDateTime = moment(getEndDate).add(getMaxHours, 'h').add(getMaxMinutes, 'm')

      const StartDateTimeUjian = moment(FullDateTime).format('YYYY-MM-DD HH:mm')
      const EndDatetimeUjian = moment(EndDateTime).format('YYYY-MM-DD HH:mm')
      const DatetimesNow = moment().format('YYYY-MM-DD HH:mm')

      console.log(DatetimesNow + '% ' + StartDateTimeUjian)
      console.log(DatetimesNow + '% ' + EndDatetimeUjian)
      /** */
      if(moment(DatetimesNow).isSame(StartDateTimeUjian)){
        startButton = true
        console.log('Ujian di Mulai')
      } else if(moment(DatetimesNow).isAfter(StartDateTimeUjian) && moment(DatetimesNow).isBefore(EndDatetimeUjian)){
        startButton = true
        console.log('Ujian di Mulai')
      } else if(moment(DatetimesNow).isBefore(StartDateTimeUjian)){
        console.log('Ujian Belum di Mulai')
        countDowntimmer = true
      } else if(moment(DatetimesNow).isAfter(EndDatetimeUjian)){
        expireButton = true
      }
      return res.status(200).json({
        success : 'true',
        message :' Ujian'+ id +' Di Temukan',
        data :GetUjian,
        //sesi_ujian: GetSesiUjian,
        start_ujian: startButton,
        current_times: DatetimesNow,
        start_time :StartDateTimeUjian,
        end_times: EndDatetimeUjian,
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