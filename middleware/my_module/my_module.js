const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../../models/index');

/**
 * Check if my_module is exist
 * @requires auth firebase
 * @requires my_module id
 */

 module.exports = MyModule = async (req, res, next) => {
  const id = req.query.my_module;
  // const auth ={
  //   uid: 'RUYt9141jdfNzORYS1HCTCrH1K93'
  // }
  const user_id = req.auth.uid;
  try {
    const my_module = await db.my_module.findOne({
      where: {
        id: {
          [Op.eq]: id
        },
        user_id: {
          [Op.eq]: user_id
        }
      }
    })
    if (my_module) {
      console.log('my module dengan = ' + id + ' ditemukan');
      next()
    } else {
      return res.status(404).json({
        success: 'false',
        error: 'Not Found',
        message: 'My Module tidak ditemukan'
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: 'false',
      error: error
    })
  }
 }