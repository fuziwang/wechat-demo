const xmlparse = require('xml2js').parseString;

var xmltext = `
	<xml>
		<from>frewen</from>
		<p>second</p>
		<message><![CDATA[<p>content</p>if(a<b){console.log(a);}]]></message>
	</xml>
`
xmlparse(xmltext,{explicitArray:true},(err,result)=>{
	if(err){
		console.log(err);
	} else {
		console.log(result);
		console.log(result.xml.message);
	}
});

