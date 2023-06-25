(async function(){
	const mysql = require('mysql2/promise');
	const koa = require('koa');
	const Static = require('koa-static-cache');
	const Router = require('koa-router');
	const bodyParser = require('koa-bodyparser');
	const fs=require('fs');
	
	const app=new koa();
	const router=new Router();
	//静态
	app.use(Static('./static',{
		prefix:'/static',
		gzip:true
	}))
	
	//body解析
	app.use(bodyParser());
	
	//连接数据库
	const connection =await mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password:'1234',
	  database: 'node'
	});
	
	router.get('/',ctx=>{
		const content=fs.readFileSync('./static/index.html');
		ctx.body=content.toString()
	})
	router.get('/list',async ctx=>{
		let [arr]=await connection.query("SELECT * FROM todolist");
		ctx.body={
			code:0,
			data:arr
		}
	});
	router.post('/add',async ctx=>{
		const name=ctx.request.body.name;
		const price=ctx.request.body.price;
		const number=ctx.request.body.number;
		let [data]=await connection.query("INSERT INTO todolist (name,price,number) VALUES('"+name+"','"+price+"','"+number+"')");
		if(data.affectedRows>0){
			ctx.body={
				code:0,
				data:"添加成功"
			}
			
		}else{
			ctx.body={
				code:1,
				data:"添加失败"
			}
		}
	});
	router.post('/change',async ctx=>{
		const id=ctx.request.body.id;
		const name=ctx.request.body.name;
		const price=ctx.request.body.price;
		const number=ctx.request.body.number;
		//console.log(id,name,price,number)
		let query="UPDATE todolist SET name=?,price=?,number=?WHERE id=?"
		const value=[name,price,number,id]
		let [data]=await connection.query(query,value);
		if(data.affectedRows>0){
			ctx.body={
				code:0,
				data:"修改成功"
			}
			
		}else{
			ctx.body={
				code:1,
				data:"修改失败"
			}
		}
	});
	router.post('/remove',async ctx=>{
		const id=ctx.request.body.id;
		
		//console.log(id,name,price,number)
		let query="DELETE FROM todolist WHERE id=?"
		const value=id
		let [data]=await connection.query(query,value);
		if(data.affectedRows>0){
			ctx.body={
				code:0,
				data:"删除成功"
			}
			
		}else{
			ctx.body={
				code:1,
				data:"删除失败"
			}
		}
	})
	
	
	
	//连接数据库并查询
//	let arr=await connection.query("SELECT * FROM todolist")
//	console.log(arr)
app.use(router.routes());
app.listen(8080);
})();
