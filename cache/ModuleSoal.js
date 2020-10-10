"use strict"
const Redis             = require('ioredis');
const client            = new Redis();
class ModuleSoalCache{
	/**
	 * Set Cache by User code
	 * @param {*} req 
	 */
	async getCache(req,res,next){
			
		let param = req.baseUrl+req.url;
		
		client.get(param, function (err, data) {

			if (err) {
				return res.status(500).json({
						success:'false',
						data : err
				})
			}

			if (data) {
				let temp  = JSON.parse(data);
				
				return res.status(200).json({
					success:'true',
					message:'Module Soal Latiahan',
					rows : temp.rows,
					count: temp.count
				});

			} else {
				
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
		client.set(getKey, JSON.stringify(data),'EX',7200 ,function(err ,success){
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

module.exports = new ModuleSoalCache();