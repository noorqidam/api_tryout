'use strict'
const redis = require('redis')
const RedisClient = redis.createClient();

class PublisherQuizMessagee {
  storedAnswered (topic ,data) {
    RedisClient.publish(topic,data)
  }
}

module.exports = new PublisherQuizMessagee()