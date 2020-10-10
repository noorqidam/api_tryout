'use strict'
const	express  	=	require('express');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const	router 		= 	express.Router();
const db      = require('../../../models/index');


/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/',async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 200;
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'ASC';
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  try {
    const GetMataPelajaran = await db.mata_pelajaran.findAndCountAll({
      limit : limit,
      offset : offset,
      order :[['id',ORDER]]
    });
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data : GetMataPelajaran
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

/** Find By Id  */

router.get('/:id',async (req, res) => {
  let id = req.params.id
  try {
    const GetMataPelajaran = await db.mata_pelajaran.findOne({
      where : {
        id: {
          [Op.eq]: id
        }
      }
    });

    if (GetMataPelajaran) {
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan ' ,
        data : GetMataPelajaran
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



module.exports	=	router;