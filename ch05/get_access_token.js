const awyhttp = require('awyhttp');

var appid = 'wx602555447c8e4a04';
var appsecret = '1486bbde83ab2cfb5211f223b5bef0f9';

var token_api = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;

awyhttp.get(token_api).then(data => {
    console.log(data);
}, err => {
    console.log(err);
})
