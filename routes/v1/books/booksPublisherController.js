'use strict'
const	express  	=	require('express');
const { Books } = require('../../../models/mongoose/Book')
const { Moduletheme } = require('../../../models/mongoose/Moduletheme')
const	router 		= 	express.Router();

/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/',async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 100;
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'DESC';
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  try {
    let auth = req.auth;
    const aggregateBooks = await Books.aggregate([
      {
        $match: {
          publisher : { $eq: auth.accountkey}
        }
      },
      {"$group" : { _id :"$module_type",'count':{$sum:1}}}
    ]);
    const aggregateKelas = await Books.aggregate([
      {
        $match: {
          publisher : { $eq: auth.accountkey}
        }
      },
      {"$group" : { _id :"$kelas",'count':{$sum:1}}}
    ]);
    const count = await Books.countDocuments({
      publisher: auth.accountkey
    });
    const BooksData = await Books.find({ publisher : auth.accountkey})
      .limit(limit)
      .skip(offset)
      .sort({ _id : -1})

    let dataCache = {
      rows : BooksData,
      total: count,
      type: aggregateBooks,
      kelas:aggregateKelas
    }
    // let Cachekey = req.baseUrl + req.url;
    // BanksSoalCache.setCache(Cachekey,dataCache)
    return res.status(201).json({
      success : 'true',
      message :'Books Data',
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

router.get('/:id',async (req, res) => {
  let id = req.params.id
  try {
    let auth = req.auth;
    const BooksData = await Books.find({ _id: id, publisher : auth.accountkey})
    
    if (BooksData) {
      const GetModuletheme = await ModuleTheme.find({ module_id :BooksData.key})
      return res.status(201).json({
        success : 'true',
        message :'Books Data',
        data : BooksData,
        theme: GetModuletheme
      });
    } else {
      return res.status(404).json({
        success : 'false',
        message :'Data Module tidak Di Temukan'
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
* Stored a newly created resource in storage.
*
* @request body of Object type
*/

router.post('/',async (req, res) => {
  
  try {
    let module_name = req.body.module_name;
    let module_slug = req.body.module_slug;
    let image = req.body.image
    let price = req.price
    let description = req.body.description;
    let categories = req.body.categories;
    let module_type = req.module_type;
    const SaveModules = new Moduletheme({
      key: getNextSequenceValue('key'),
      module_name: module_name,
      module_slug: module_slug,
      image: image,
      price:price,
      description:description,
      // code_number: 
      // kelas:[String],
      // publisher: { type: String },
      // module_authors: [String],
      // categories:[String],
      // module_type: { type: String },
      // tags:[String],
      publish: true
    })

    let infoSave = await SaveModules().save()

    return res.status(201).json({
      success : 'true',
      message :'Berhasil buat Book',
      data : infoSave
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
  
});

/**
* Remove the specified resource from storage.
*
* @param  int  id
*/
router.delete('/:id',async (req, res) => {
  
});

function getNextSequenceValue(sequenceName){
  var sequenceDocument = Books.findAndModify({
     query:{key: sequenceName },
     update: {$inc:{sequence_value:1}},
     new:true
  });
  return sequenceDocument.sequence_value;
}

module.exports	=	router;