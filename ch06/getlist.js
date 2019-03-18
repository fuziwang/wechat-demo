const awyhttp = require('awyhttp');
const weicall = require('./weixinToken.js');

weicall.getToken().then((ret)=>{
	if(!ret.status){
		throw ret.data;
	}
	var getlist_api = `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${ret.data}`;

	module.exports = awyhttp.post(getlist_api,{
		data:{
			"type":"image",
			"offset":0,
			"count":2
		},
		headers:{
			"Content-Type":'text/plain'
		}
	}).then(data => {
		    console.log(data);
				module.exports = data.item;
	}, err => {
		    console.log(err);
	}).catch(err=>{console.log(err)});
})
