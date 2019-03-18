const awyhttp = require('awyhttp');
const weicall = require('./weixinToken.js');

weicall.getToken().then((ret)=>{
	if(!ret.status){
		throw ret.data;
	}

	var getmenu_api = `https://api.weixin.qq.com/cgi-bin/get_current_selfmenu_info?access_token=${ret.data}`;

	return awyhttp.get(getmenu_api).then(data=>{
		console.log(data);
	},err=>{
		throw err;
	}).catch(err=>{console.log(err)});
})
