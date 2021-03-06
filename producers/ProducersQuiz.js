'use strict'
const redis = require('redis')
const RedisClient = redis.createClient();

/**
 * this Producers Message
 * @requires topic , data { object }
 * example https://redis.io/topics/pubsub
 */ 
class PublisherQuizMessage {
  storedAnswered (topic ,data) {
    RedisClient.publish(topic,data)
  }
}

module.exports = new PublisherQuizMessage()