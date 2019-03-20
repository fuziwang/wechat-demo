const fs = require('fs');

function cpf(from_file,to_file){
	new Promise((rv,rj)=>{
		fs.readFile(from_file,{encoding:'utf-8'},(err,data)=>{
			if(err){
				rj(err);
			} else {
				rv(data);
			}
		});
	}).then(data=>{
		new Promise((rv,rj)=>{
			fs.writeFile(to_file,data,{encoding:'utf-8'},(err)=>{
				if(err){
					rj(err);
				} else {
					rv('ok');
				}
			});
		}).then(data=>{
			return data;
		},err=>{
			console.log(err.message);
		}).catch(err=>{console.log(err.message)});
	},err=>{
		console.log(err);
	}).catch(err=>{console.log(err)})
}

cpf('test.code', 'promise-async-await.code')