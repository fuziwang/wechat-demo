const awyhttp = require('awyhttp');
const wxcall = require('./weixinToken.js');
const fs = require('fs');

var media_id = 'M6E5GRzmw_1meSkQTyDiHMY7xFIjX_pp8CTdWnJ2rxs';

function writfile(filename,data){
    fs.writeFile(filename, data, {encoding:'utf8'}, err => {
        if (err) {
            return err;
        } else {
            return 'ok';
        }
    });
}

async function getnews(media_id){
    var ret = await wxcall.getToken();
    if(!ret.stats){
        throw ret.data;
    }
    var get_news_api = `https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=${ret.data}`;
    
   var data =  await awyhttp.post(get_news_api,{headers : {'Content-Type' : 'text/plain'},data : {media_id : media_id}});
    return awiat writfile();
}

getnews(media_id).then(data=>{
    console.log(data);
},err=>{
    console.log(err)
}).catch(err=>{console.log(err)});