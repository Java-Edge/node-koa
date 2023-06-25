var koa=require('koa');
var Router=require('koa-router');
var koaStaticCache=require('koa-static-cache');
var bodyParser=require('koa-bodyparser');
var fs=require('fs')
/*
 * 通过服务器请求拿到一个基础页面，后续的操作就不需要浏览器发送请求了
 * 因为浏览器发送请求会导致浏览器重新渲染
 * 将js代码写入基础页面中，然后通过ajax来发送请求，通过ajax发送请求不会
 * 重新渲染页面，他会把请求到的数据存储到ajax对象中
 * */


var app=new koa();

let datas=JSON.parse(fs.readFileSync('./index.json'));

//静态
app.use(koaStaticCache('./static',{
	prefix:'/static',
	gzip:true
}));

//body解析
app.use(bodyParser());


//路由
var router=new Router();
router.get('/',async ctx=>{
	ctx.body=""
});

router.get('/list',async ctx=>{
	//ctx.body={x:1,y:2}//{"x":1,"y":2}
	//ctx.body=datas.list
	ctx.body={
		code:1,
		data:datas.list
	}
});
//删除商品
router.post('/remove',async ctx=>{
	let id=ctx.request.body.id||0;
	if(!id){
		ctx.body={
			code:1,
			data:"请传入id"
		}
		return;
	};
	
	datas.list=datas.list.filter(item=>item.id!=id)
	ctx.body={
		code:0,
		data:datas.list
		
	};
	fs.writeFileSync('./index.json',JSON.stringify(datas));
	
});
//添加商品
router.post('/change',async ctx=>{
	let name=ctx.request.body.name;
	let price=ctx.request.body.price;
	let number=ctx.request.body.number;
	datas.list.push({
		id:++datas.maxId,
		name:name,
		price:price,
		number:number
	})


	ctx.body={
		code:0,
		data:datas.list
		
	};
	fs.writeFileSync('./index.json',JSON.stringify(datas));
});

//修改商品信息
router.post('/change',async ctx=>{
	let id=ctx.request.body.id||0;
	let name=ctx.request.body.name;
	let price=ctx.request.body.price;
	let number=ctx.request.body.number;
	if(!id){
		ctx.body={
			code:1,
			data:"请传入id"
		}
		return;
	};
	
	for(var i=0;i<datas.list.length;i++){
		if(datas.list[i].id==id){
			datas.list[i]={
				id:id,
				name:name,
				price:price,
				number:number
			}

		}
	};
	ctx.body={
		code:0,
		data:datas.list
		
	};
	fs.writeFileSync('./index.json',JSON.stringify(datas));
});



app.use(router.routes());
app.listen(8080);







