const awyhttp = require('awyhttp');
const weicall = require('./weixinToken.js');
const count = require('./getcount.js');
const list = require('./getlist.js');

weicall.getToken().then(ret=>{
	if(!ret.status){
		throw ret.data;
	}

	var download_api = `https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=${ret.data}`;

	for(var i = 0;i<count;i++){
		(function(j){
			awyhttp.download(download_api,{
				method:'POST',
				data:{
					media_id:list[j].media_id
				},
				headers:{
					'Content-Type':'text/plain'
				},
				target:'./image/' + j + '.jpg'
			}).then(ret=>{
				console.log('ok');
			},err=>{
				console.log(err)
			}).catch(err=>{console.log(err)});
		})(i);
	}
})
