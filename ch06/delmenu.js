const awyhttp = require('awyhttp');
const weicall = require('./weixinToken.js');

weicall.getToken().then((ret)=>{
	if(!ret.status){
		throw ret.data;
	}

	var delmenu_api = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${ret.data}`;

	return awyhttp.get(delmenu_api).then(data=>{
		console.log(data);
	},err=>{
		throw err;
	}).catch(err=>{console.log(err)});
})
