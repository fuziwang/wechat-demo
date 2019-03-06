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
		default:;
	}
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
				if(xmlmsg.MsgType === 'text'){
					var data = {
						touser:xmlmsg.FromUserName,
						fromuser:xmlmsg.ToUserName,
						msg:xmlmsg.Content,
						msgtime:parseInt(new Date().getTime()/1000),
						msgtype:'text'
					};
					console.log(data);
					console.log(format(data));
					rv(format(data));
				} else {
						rv('false');
				}
			}
		})
		}).then((data)=>{
			rr.res.Body = data;
		}).catch(err=>{console.log(err);});
});

ant.run('0.0.0.0',80);
