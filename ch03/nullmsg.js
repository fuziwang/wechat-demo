const awy = require('awy');
const xmlparse = require('xml2js').parseString;

const ant = new awy();

function format(data){
	switch(data.msgtype){
		case 'text':
			return `
				<xml>
					<ToUserName><![CDATA[${data.touser}]]></ToUserName>
					<FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
					<CreateTime><![CDATA[${data.msgtime}]]></CreateTime>
					<MsgType><![CDATA[${data.msgtype}]]></MsgType>
					<Content><![CDATA[${data.msg}]]></Content>
				</xml>
			`;
		case 'image':
			return `
				<xml>
					<ToUserName><![CDATA[${data.touser}]]></ToUserName>
					<FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
					<CreateTime><![CDATA[${data.msgtime}]]></CreateTime>
					<MsgType><![CDATA[${data.msgtype}]]></MsgType>
					<Image>
						<MediaId><![CDATA[${data.msg}]]></MediaId>
					</Image>
				</xml>
			`;
		case 'voice':
			return `
				<xml>
					<ToUserName><![CDATA[${data.touser}]]></ToUserName>
					<FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
					<CreateTime><![CDATA[${data.msgtime}]]></CreateTime>
					<MsgType><![CDATA[${data.msgtype}]]></MsgType>
					<Voice>
						<MediaId><![CDATA[${data.msg}]]></MediaId>
					</Voice>
				</xml>
			`;
		case 'shortvideo':
			return `
				<xml>
					<ToUserName><![CDATA[${data.touser}]]></ToUserName>
					<FromUserName><![CDATA[${data.fromuser}]]></FromUserName>
					<CreateTime><![CDATA[${data.msgtime}]]></CreateTime>
					<MsgType><![CDATA[${data.msgtype}]]></MsgType>
					<Video>
						<MediaId><![CDATA[${data.msg}]]></MediaId>
						<ThumbMediaId><![CDATA[${data.thumb}]]></ThumbMeiaId>
					</Video>
				</xml>
			`;
		default:;
	}
}
var arr = [];
function userMsgHandle(wxmsg,retmsg){
	if(wxmsg.MsgType === 'text'){
		switch(wxmsg.Content){
			case '你好':
			case '关于我':
				retmsg.msgtype = 'text';
				retmsg.msg = '你好，请输入内容，他将返回相应的信息，如果想得到我的名字，请回复1，如果想得到我的爱好，请回复2';
				return format(retmsg);
			case '1':
				retmsg.msgtype = 'text';
				retmsg.msg = '原来你这么喜欢我啊，我叫frewen';
				return format(retmsg);
			case '2':
				retmsg.msgtype = 'text';
				retmsg.msg = '这你都不知道啊，我的爱好当然是你啊';
				return format(retmsg);
			case 'image':
				arr.length === 0?retmsg.msgtype = 'text':retmsg.msgtype='image';
				arr.length === 0?retmsg.msg = '请先输入图片':retmsg.msg = arr[parseInt(Math.random()*arr.length)];
				return format(retmsg);
		}
	} 
	switch(wxmsg.MsgType){
			case 'text':
				retmsg.msg = wxmsg.Content;
				retmsg.msgtype = 'text';
				break;
			case 'image':
				retmsg.msg = wxmsg.MediaId;
				retmsg.msgtype = 'image';
				if(arr.length === 10){
					arr.shift();
				}
				arr.push(retmsg.msg);
				break;
			case 'voice':
				retmsg.msg = wxmsg.MediaId;
				retmsg.msgtype = 'voice';
				break;
			case 'shortvideo':
				retmsg.msg = wxmsg.MediaId;
				retmsg.thumb = wxmsg.ThumbMediaId;
				retmsg.msgtype = 'shortvideo';
				break;
			default:
				retmsg.msg = '不支持的类型';
				retmsg.msgtype='text';
		}
		//console.log(retmsg);
		return format(retmsg);
}
ant.post('/wx',async rr=>{
	// 输出微信服务器转发的消息
	console.log(rr.req.GetBody());
	await new Promise((rv,rj)=>{
		xmlparse(rr.req.GetBody(),{explicitArray:false},(err,result)=>{
			if(err){
				rr.res.Body = '';
			} else {
				var xmlmsg = result.xml;
				var data = {
					touser:xmlmsg.FromUserName,
					fromuser:xmlmsg.ToUserName,
					msg:'',
					msgtime:parseInt(new Date().getTime()/1000),
					msgtype:''
				};
				//console.log(userMsgHandle(xmlmsg,data));
				rv(userMsgHandle(xmlmsg,data));
			}
		})
	}).then((data)=>{
		rr.res.Body = data;
	}).catch(err=>{console.log(err);});
});

ant.run('0.0.0.0',80);
