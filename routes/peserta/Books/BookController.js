'use strict'
const	express  	=	require('express');
const { Books } = require('../../../models/mongoose/Book')
const { Moduletheme } = require('../../../models/mongoose/Moduletheme')
// const BookService = require('./bookservice')
const { param, validationResult } = require('express-validator');
const BookCache = require('../../../cache/BookCache')
const	router 		= 	express.Router();

/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/',BookCache.getCache,async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 100;
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'DESC';
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  try {
    const count = await Books.countDocuments();
    const getBooks = await Books.find()
      .limit(limit)
      .skip(offset)
      .sort({ _id : -1})

    let dataCache = {
      rows : getBooks,
      total: count
    }
    let Cachekey = req.baseUrl + req.url;
    BookCache.setCache(Cachekey,dataCache)
    return res.status(201).json({
      success : 'true',
      message :'Success',
      data : dataCache
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

router.get('/:id',[
  param('id').not().isEmpty().withMessage('id is required')
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).json({ errors: errors.array() ,validate : false });
  } else {
    let id = req.params.id
    try {
      const GetOneBook = await Books.findById(id)
      if (GetOneBook) {
        const Theme = await Moduletheme.find({ module_id: GetOneBook.key})
        let dataCache = {
          book : GetOneBook,
          themes: Theme
        }
        let Cachekey = req.baseUrl + req.url;
        BookCache.setCache(Cachekey,dataCache)
        return res.status(200).json({
          success : 'true',
          message :'Data Di Temukan',
          data : dataCache
        });
      }else {
        return res.status(404).json({
          success : 'true',
          message :'Data Di Temukan',
          data : GetOneBook
        });
      }
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
 
});


module.exports	=	router;