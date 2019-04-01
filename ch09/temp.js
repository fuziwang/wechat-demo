const awyhttp = require('awyhttp');
const wxcall = require('./weixinToken.js');

wxcall.getToken().then(ret=>{
    if(!ret.status){
        throw new Error(ret.data);
    }
    var qrcode_api = `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${ret.data}`;
    var post_data = {"expire_seconds": 604800, "action_name":"QR_SCENE", "action_info": {"scene":{"scene_str": "hello_frewen"}}};
    return awyhttp.post(qrcode_api,{
        headers:{
            "Content-Type":"text/plain"
        },
        data:post_data
    }).then(retdata=>{
        //console.log(retdata);
        var ret = JSON.parse(retdata);
        if(ret.ticket === undefined){
            throw new Error(retdata);
        }
        return ret.ticket;
    },err=>{console.log(err)});
},err=>{console.log(err)}).then(ticket=>{
    var down_qrcode_api = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`;
    return awyhttp.download(down_qrcode_api,{
        method:'GET',
        target:'./qrcode' + ((new Date()).getTime()) + '.jpg'
    }).then(ret=>{
        //console.log(ret); true
        console.log('ok');
    },err=>{console.log(err)});
}).catch(err=>{
    console.log(err);
})
