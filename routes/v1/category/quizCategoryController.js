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
  let limit =parseInt(req.query.limit) || 100;
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'DESC';
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  try {
    const category_quiz = await db.category_quiz.findAndCountAll({
      limit : limit,
      offset : offset,
      order :[['id',ORDER]]
    });

    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :category_quiz
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
    const category_quiz = await db.category_quiz.findOne({
     where : {
      id : {
        [Op.eq] : id
       },
     }
    });
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :category_quiz
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

router.post('/',async (req, res) => {
  try {
    let data = req.body;
    const category_quiz = await db.category_quiz.create(data)
    return res.status(201).json({
      success : 'true',
      message :'Success Add',
      data : category_quiz
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
* Update the specified resource in storage.
*
* @param  int  id
* @return Response
*/

router.put('/:id',async (req, res) => {
  try {
    let id = req.params.id
    let data = req.body;
    const category_quiz = await db.category_quiz.update(data, {
      where : {
        id: {
          [Op.eq] : id
        }
      }
    })

    return res.status(201).json({
      success : 'true',
      message :'Success Update ' + req.body.title,
      data : category_quiz
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
* Remove the specified resource from storage.
*
* @param  int  id
*/
router.delete('/:id',async (req, res) => {
  try {
    let id = req.params.id
    const category_quiz = await db.category_quiz.destroy({
      where : {
        id: {
          [Op.eq] : id
        }
      }
    });
    return res.status(201).json({
      success : 'true',
      message :'Success Deleted',
      data : category_quiz
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