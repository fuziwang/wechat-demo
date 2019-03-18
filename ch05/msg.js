const awyhttp = require('awyhttp');

var appid = 'wx602555447c8e4a04';
var appsecret = '1486bbde83ab2cfb5211f223b5bef0f9';

var token_api = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;

var menu_data = {
	button:[
		{
			name:"study",
			sub_button:[
				{
					name:"Linux",
					type:"view",
					url:"https://fuziwang.top"
				},
				{
					name:"node.js",
					type:"pic_weixin",
					key:"my-image"
				},
				{
					name:"location",
					type: "location_select", 
					key: "rselfmenu_2_0"
				}
			]
		},
		{
			name:"关于我们",
			type:"click",
			key:"about-us"
		}
	]
}

awyhttp.get(token_api).then(data=>{
		var ret = JSON.parse(data);
		console.log(ret);
		if(ret.errcode !== undefined){
			throw ret.errmsg;
		} else {
			return ret;
		}
}, err => {
		throw err;
}).catch(err=>{
		console.log(err);
}).then(ret => {
		//console.log(ret);
		var json_menu = JSON.stringify(menu_data);
		//console.log(json_menu);
		var create_menu_api = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${ret.access_token}`;

		return awyhttp.post(create_menu_api,{
				data:json_menu,
				headers:{"Content-Type":"text/plain"}
		}).then(data=>{
				console.log(data);
		},err => {
				//console.log(err);
		})
});

