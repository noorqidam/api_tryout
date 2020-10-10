'use strict'
const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );

/*
======================================
Make a simple queue and send/receive messages
======================================
*/


module.exports.createQueueUjian= async function (queuename) {
	// create a queue
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
		// start checking for messages every 500ms
		//receiveMessageLoop(queuename);
	});
}



module.exports.receiveMessageLoop =  async function (queuename) {
  rsmq.receiveMessage({ qname: queuename }, (err, resp) => {
    if (err) {
      console.error(err);
      return;
    }

    // checks if a message has been received
    if (resp.id) {
      console.log("received message:", resp.message); /// 

      // we are done with working on our message, we can now safely delete it
      rsmq.deleteMessage({ qname: queuename, id: resp.id }, (err) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log("deleted message with id", resp.id); /// function task done
      });
    } else {
      console.log("no available message in queue..");
    }
  });
}


