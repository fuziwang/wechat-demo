const express = require('express');

const app = express();

app.post('/wx',(req,res)=>{
	console.log(req.BodyParam);
	res.send('success');
});

app.listen(80);
