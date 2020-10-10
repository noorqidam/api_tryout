const { JawabQuiz  } = require('../../../models/mongoose/JawabQuiz');

async function SendRealtimeRattingPesertaQuiz (req,res) {
  let RealtimeSocket = res.io; // realtime socker
   /** Get Current Ratting Quiz  for tryout.com*/
  const RattingPeserta = await JawabQuiz.aggregate([
    { $match: { quiz_id: { $eq: GetSoalQuiz.quiz_id }} },
    {"$group" : { _id :{ user_id :"$user_id", photo :"$photo"},'count':{$sum:1} ,"total_point": { "$sum": "$jawaban.point" } }},
    { $sort: { "total_point": -1 }}
  ]);

  RealtimeSocket.emit('show_ratting'+id,{RattingPeserta}); //trigger realtime monitoring
}