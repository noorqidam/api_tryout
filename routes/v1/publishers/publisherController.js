'use strict'
const	express  	=	require('express');
const { check, validationResult } = require('express-validator');
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
  let limit =parseInt(req.query.limit) || 100;
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'DESC';
  let ORDER = 'DESC';
  if (sort) {
  ORDER = sort.toUpperCase();  
  }
  try {
    const publisher = await db.publisher.findAndCountAll({
      limit : limit,
      offset : offset,
      order :[['id',ORDER]]
    });
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :publisher
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
    const publisher = await db.publisher.findOne({
      where : {
        id: {
          [Op.eq]: id
        }
      }
    });

    if (publisher) {
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan ' ,
        data : publisher
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

router.post('/', [
  check('badan_usahan').exists().withMessage('required'),
  check('name').not().isEmpty().withMessage('required'),
  check('subtitle_name').exists().withMessage('required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let data = req.body;
    let code = '';
    let number = 0;
    switch(data.badan_usaha) {
      case 'PENERBIT':
        code = 'P'
        break;
      case 'SEKOLAH':
        code = 'S'
        break;
      case 'KURSUS':
        code = 'K'
        break;
      case 'BIMBEL':
        code = 'B'
        break;
      case 'UNIVERSITAS':
        code = 'U'
        break;
      case 'PEMBICARA':
        code = 'PE'
        break;
      default:
        code = 'L'
    }
    const cn = await db.publisher.findAll({
      where: {
        code_number:{ [Op.like]: `${code}%`}
      },
      attributes: ['code_number'],
      order: [['created_at', 'DESC']],
      limit: 1
    });
    if(cn.length>0){
      number = parseInt(JSON.parse(JSON.stringify(cn[0].code_number)).substr(1));
    }
    const code_number = (`${code}0000`).slice(0,-parseInt(number.toString().length)) + (number+1)
    data.code_number = code_number;
    data.created_by = req.auth.id;
    data.created_at = Date.now();
    try {
      const Publisher = await db.publisher.create(data);
      return res.status(201).json({
        success : 'true',
        message :'Success Add',
        data : Publisher
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

router.put('/:id', async (req, res) => {
  try {
    let id = req.params.id
    let data = req.body;
    data.updated_at = Date.now();
    data.updated_by = req.auth.id;
    const publisher = await db.publisher.update(data, {
      where : {
        id: {
          [Op.eq] : id
        }
      }
    })
    
    if (publisher[0] === 1) {      
      return res.status(201).json({
        success : 'true',
        message :'Success Update ' + req.body.name,
        data : publisher
      });
    } else {
      return res.status(404).json({
        success: 'false',
        message: 'Failed to Update ' + req.body.name + ' no publisher with such id',
        data: publisher
      })
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
    }
});

router.delete('/:id',async (req, res) => {
  try {
    let id = req.params.id;
    let data = {
      deleted_at : Date.now(),
      status_delete : true,
      deleted_by : req.auth.id
    };
    const publisher = await db.publisher.update(data, {
      where : {
        id: {
          [Op.eq] : id
        }
      }
    })
    
    if (publisher[0] === 1) {      
      return res.status(201).json({
        success : 'true',
        message :'Success Delete ' + req.params.id,
        data : publisher
      });
    } else {
      return res.status(404).json({
        success: 'false',
        message: 'Failed to Delete ' + req.query.id + ' no publisher with such id',
        data: publisher
      })
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