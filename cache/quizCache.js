"use strict"
const Redis             = require('ioredis');
const client            = new Redis();


class QuizCache{
	/**
	 * Set Cache by User code
	 * @param {*} req 
	 */
	async getCache(req,res,next){
			
		let param = req.baseUrl+req.url;
		
		client.get(param, function (err, data) {

			if (err) {
				console.log(err)
				//next();
				return res.status(500).json({
						success:'false',
						data : err
				})
			}

			if (data) {
				let temp  = JSON.parse(data);
				
				return res.status(200).json({
					success:'true',
					message:'Data Quiz',
					data : temp
				});
			} else {
				console.log('not Found cache ');
				next();
			}
		});
	}
	/**
	 * set cache BankSoal
	 * @param {*} key 
	 * @param {*} data 
	 */
	async setCache(key,data) {
		let getKey = key;
		client.set(getKey, JSON.stringify(data),'EX',3600 ,function(err ,success){
			if (err) {
				console.log('Cache gagal');
			}
		});
	}
	/**
	 * Delete Cache BankSoal
	 * @param {*} key 
	 */
	async deleteCache(url) {
		let getKey = url;
		client.del(getKey);
	}

	async deleteCacheAll(){
		client.flushall();
	}
}

module.exports = new QuizCache();