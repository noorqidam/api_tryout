'use strict'
const	express  	=	require('express');
const { Books } = require('../../../models/mongoose/Book')
const { Moduletheme } = require('../../../models/mongoose/Moduletheme')
const BookService = require('./bookservice')
const BookCache = require('../../../cache/BookCache')
const { check, validationResult } = require('express-validator');
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

    // const books = new BookService()
    // const findBooks = await books.find()
    // return res.status(200).json({
    //   success : 'true',
    //   message :'Data Di Temukan',
    //   data :findBooks
    // });

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
    const GetOneBook = await Books.findById(id)
    if (GetOneBook) {
      const Theme = await Moduletheme.find({ module_id: GetOneBook.key})
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data : GetOneBook,
        theme : Theme
      });
    }else {
      return res.status(200).json({
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
});

/**
* Stored a newly created resource in storage.
*
* @request body of Object type
*/

router.post('/',[
  check('judul_quiz').not().isEmpty().withMessage('required'),
  check('quiz_slug').not().isEmpty().withMessage('required'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).json({ errors: errors.array() ,validate : false });
  } else {
    try {
      
      let module_name = req.body.module_name;
      let module_slug = req.body.module_slug;
      let image = req.body.image
      let price = req.body.price
      let description = req.body.description;
      let categories = req.body.categories;
      let module_type = req.module_type;
      let author = req.body.author
      let tags = req.body.tags;
      let code_number = ''
      const getLastBook = await Books.find({}).sort({ key: -1}).limit(1)
      const countId = getLastBook[0].key
      Books.init()
      const SaveModules = new Books({
        key: countId,
        module_name: module_name,
        module_slug: module_slug,
        image: image,
        price:price,
        description:description,
        code_number: code_number,
        kelas:[String],
        publisher: { type: String },
        module_authors: author,
        categories:categories,
        module_type: module_type,
        tags: tags,
        publish: true
      })

      let infoSave = await SaveModules.save()

      return res.status(201).json({
        success : 'true',
        message :'Berhasil buat Book',
        data : infoSave
      });
    
    } catch (error) {
      console.log('ini err')
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

router.put('/:id',async (req, res) => {
  
});

/**
* Remove the specified resource from storage.
*
* @param  int  id
*/
router.delete('/:id',async (req, res) => {
  
});


function getNextSequenceValue(){
  const getLastBook = Books.findOne({}).sort({ key: 1})
  console.log(getLastBook)
  return getLastBook.key;
}

module.exports	=	router;