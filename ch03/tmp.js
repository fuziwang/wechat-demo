const awy = require('awy'),
      xmlparse = require('xml2js').parseString;

var ant = new awy();

// 功能是当输出image时，从之前上传的照片中随机选择一张进行返回
var imageLog = new function() {
    var the = this;

    this.list = [];

    this.randImage = function() {
        if (the.list.length == 0) {
            return null;
        }
        // var ind = parseInt(Math.random()*the.list.length);
        var ind = Math.random() * 1024;
        ind = parseInt(ind % the.list.length);
        console.log(ind);
        return the.list[ ind ];
    };
};

function format(data){
    //尽管只处理文本消息，这样写的目的是为了后续添加更多的消息类型。
    switch(data.msgtype) {
        case 'text':
            return `
                <xml>
                    <ToUserName><![CDATA[${data.touser}]]></ToUserName>
                    <FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[${data.msg}]]></Content>
                    <CreateTime>${data.msgtime}</CreateTime>
                </xml>
            `;

        case 'image':
            return `
                <xml>
                    <ToUserName><![CDATA[${data.touser}]]></ToUserName>
                    <FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
                    <MsgType><![CDATA[image]]></MsgType>
                    <Image>
                        <MediaId><![CDATA[${data.msg}]]></MediaId>
                    </Image>
                    <CreateTime>${data.msgtime}</CreateTime>
                </xml>
            `;
        
        case 'voice':
            return `
                <xml>
                    <ToUserName><![CDATA[${data.touser}]]></ToUserName>
                    <FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
                    <MsgType><![CDATA[voice]]></MsgType>
                    <Voice>
                        <MediaId><![CDATA[${data.msg}]]></MediaId>
                    </Voice>
                    <CreateTime>${data.msgtime}</CreateTime>
                </xml>
            `;
        default: 
            return '';
    }
}

function handle(wxmsg,rtmsg){
    if(wxmsg.MsgType === 'text'){
        switch(wxmsg.Content){
           	case 'help':
           	case '?':
                rtmsg.msgtype = 'text';
                rtmsg.msg = '输入help获取帮助信息，其他消息原样返回';
                return format(rtmsg);
            case '关于':
            case 'about':
               	rtmsg.msgtype = 'text';
                rtmsg.msg = '我们是程序员';
                return format(rtmsg);
            case 'image':
                var img = imageLog.randImage();
                if (img === null) {
                    rtmsg.msgtype = 'text';
                    rtmsg.msg = '没有图片';
                } else {
                    rtmsg.msgtype = 'image';
                    rtmsg.msg = img;
                }
                return format(rtmsg);
            default:;
        }
    }
    switch(wxmsg.MsgType){
        case 'text':
            rtmsg.msg = wxmsg.Content;
            break;
        case 'image':
            rtmsg.msg = wxmsg.MediaId;
            break;
        case 'voice':
            rtmsg.msg = wxmsg.MediaId;
            break;
        default:
            rtmsg.msg = '不支持的类型';
            rtmsg.msgtype = 'text';
    }
    if(rtmsg.msgtype === ''){
        rtmsg.msgtype = wxmsg.MsgType;
    }
    return format(rtmsg);
}

ant.post('/wx',async rr=>{
    console.log(rr.req.GetBody());
    await new Promise((rv,rj)=>{
        xmlparse(rr.req.GetBody(),{explicitArray:false},(err,result)=>{
            if(err){
                rr.res.Body = '';
                rj(err);
            } else {
                var xmlmsg = result.xml;
                
                if(xmlmsg.MsgType === 'image'){
                    imageLog.list.push(xmlmsg.MediaId)
                }
                var data = {
                    touser:xmlmsg.FromUserName,
                    fromuser:xmlmsg.ToUserName,
                    msg:'',
                    msgtime:parseInt(new Date().getTime()/1000),
                    msgtype:''
                };
                rv(handle(xmlmsg,data));
            }
        });
    }).then((data) => {
    	rr.res.Body =data;        
    }).catch(err=>{console.log(err);});
})

ant.run('0.0.0.0',80);
