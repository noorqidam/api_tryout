'use strict'
const	express  	=	require('express');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const	router 		= 	express.Router();
const db      = require('../../../models/index');
const { check, validationResult } = require('express-validator');

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
    const utbk_category_soal = await db.utbk_category_soals.findAndCountAll({
      limit : limit,
      offset : offset,
      order :[['id',ORDER]]
    });
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :utbk_category_soal
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

router.get('/:id',async (req, res) => {
  let id = req.params.id
  try {
    const utbk_category_soals = await db.utbk_category_soals.findOne({
      where : {
        id : {
          [Op.eq] : id
        },
      }
    });
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :utbk_category_soals
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
  check('category_name').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let data = req.body;
    try {
      const Category = await db.utbk_category_soals.create(data);

      return res.status(201).json({
        success : 'true',
        message :'Success Add',
        data :Category
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

router.put('/:id',[
  check('id').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let data = req.body;
    let id = req.params.id;

    try {
      const Category = await db.utbk_category_soals.update(data,{
        where : {
          id: {
            [Op.eq] : id
          }
        }
      });

      return res.status(201).json({
        success : 'true',
        message :'Success Add',
        data :Category
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
* @param  int  id
*/
router.delete('/:id',async (req, res) => {
  try {
    const Category = await db.utbk_category_soals.update({
      deleted : true
    }, {
      where : {
        id : {
          [Op.eq] : id
        }
      }
    });

    return res.status(201).json({
      success : 'true',
      message :'Success Delete',
      data :Category
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