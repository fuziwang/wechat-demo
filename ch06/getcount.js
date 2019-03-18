const awyhttp = require('awyhttp');
const weicall = require('./weixinToken.js');

weicall.getToken().then((ret)=>{
	if(!ret.status){
		throw ret.data;
	}

	var getcount_api = `https://api.weixin.qq.com/cgi-bin/material/get_materialcount?access_token=${ret.data}`;

	awyhttp.get(getcount_api).then(data=>{
		console.log(data);
		module.exports = data.image_count;
	},err=>{
		throw err;
	}).catch(err=>{console.log(err)});
})
