const awyhttp = require('awyhttp'),
			fs = require('fs');

function get_token(appid,appsecret){
		var that = this;

		this.token_api = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;

		this.token_path = '/tmp/access_token.json';

		this.getToken = async function(){
			await new Promise((rv,rj)=>{
					fs.readFile(that.token_path,{encoding:'UTF_8'},(err,data)=>{
						  var access_token_state = false;
							var access_token = '';
							if(err){
								// pass
							} else {
								var t = JSON.parse(data);
								var now_tm = (new Date()).getTime()/1000;

								if(parseInt(t.get_time) + t.expires_in > parseInt(now_tm)){
									access_token_state = true;
									rv(t.access_token);
								}

								if(access_token_state){return;}
								await awyhttp.get(that.token_api).then(data=>{
									var ret = JSON.parse(data);

									if(ret.errcode === undefined){
											ret.get_time = parseInt(new Date().getTime()/1000);
											fs.write(that.token_path,
													JSON.stringify(ret),
													{encoding:'UTF_8'},(err,data)=>{
											if(err){
											
											}
										})
									}
								});
							}
					})
			})
		}
}

module.exports = get_token;
