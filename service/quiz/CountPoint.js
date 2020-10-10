'use strict'
const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );
const { QuizUserPoint } = require('../../models/mongoose/QuizUserPoint')
// const { Profile } = require('../../../models/mongoose/profile')

class messageBrokerQuiz {
  createQueue(queuename,message) {
    rsmq.createQueue({ qname: queuename }, (err) => {
      if (err) {
        // if the error is `queueExists` we can keep going as it tells us that the queue is already there
        if (err.name !== "queueExists") {
          console.error(err);
          return;
        } else {
          console.log("queue exists.. resuming..");
        }
      }
  
      // start sending messages 
      this.sendMessage(queuename,message);
      // start checking for messages 
      this.receiveMessage(queuename);
    });
  }
  sendMessage(queuename,message) {
    rsmq.sendMessage({ qname: queuename, message: message }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
  
      console.log("pushed new message into queue..");
    });
  }
  receiveMessage(queuename) {
    rsmq.receiveMessage({ qname: queuename }, (err, resp) => {
      if (err) {
        console.error(err);
        return;
      }
  
      // checks if a message has been received
      if (resp.id) {
        console.log("received message:", resp.message);
        //proses save point

        const SavePoint = new QuizUserPoint({
          quiz_id : resp.quiz_id,
          profile_id: resp.profile_id,
          user_id:resp.user_id,
          email: { type: String },
          name: { type: String },
          school: { type: String },
          kelas: { type: String},
          sub_kelas: { type: String },
          photo: { type: String },
          point: { type : Number },
          salah: { type: Number },
          benar: { type: Number },
          date: {
            type: Date,
            default: new Date().toString()
          }
        })

        const InfoSave = await SavePoint.save()
        if (InfoSave) {
           // we are done with working on our message, we can now safely delete it
          rsmq.deleteMessage({ qname: queuename, id: resp.id }, (err) => {
            if (err) {
              console.error(err);
              return;
            }
    
            console.log("deleted message with id", resp.id);
          });
        }
       
      } else {
        console.log("no available message in queue..");
      }
    });
  }

}

const CounterPoint = async function (message) {

  const QueuePoint = new messageBrokerQuiz()
  QueuePoint.createQueue('quiz_point',message)
}

module.exports = CounterPoint