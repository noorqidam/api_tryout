'use strict'
const redis = require('redis')
const Subscribe = redis.createClient();

class QuizConsumersMessage {
  subscribeAnswered (topic) {
    Subscribe.on(topic, function(channel, message){
      console.log("Message "+ message +"on channel: " + channel);
    })
  }

  subscribeNofify () {
    Subscribe.subscribe('quiz')
  }
}


module.exports = new QuizConsumersMessage()