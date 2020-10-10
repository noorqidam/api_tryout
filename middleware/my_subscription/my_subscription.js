const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../../models/index');

/**
 * Check if my_subscription is exist
 * @requires auth firebase
 * @requires my_subscription id
 */

 module.exports = MySubscription = async (req, res, next) => {
  const id = req.query.my_subscription;
  // const auth = {
  //   uid: 'yPVg5LEz6tVliFRM1cHLlyzRcDI3'
  // };
  const user_id = req.auth.uid;
  try {
    const my_subscription = await db.my_subscription.findOne({
      where: {
        id: {
          [Op.eq]: id
        },
        user_id: {
          [Op.eq]: user_id
        }
      }
    })
    if (my_subscription) {
      if(my_subscription.expire_at > Date.now()){
        console.log('my subsscription dengan = ' + id + ' ditemukan');
        next()
      } else {
        return res.status(404).json({
          success: 'false',
          error: 'Expired',
          message: 'Langganan sudah expired'
        })
      }
    } else {
      return res.status(404).json({
        success: 'false',
        error: 'Not Found',
        message: 'My Langganan tidak ditemukan'
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