var koa=require('koa');
var koaRouter=require('koa-router');
var Swig=require('koa-swig');
var co=require('co');

var app=new koa();
var router=new koaRouter();

const render=Swig({
	root:__dirname+'/view', //模板的存放目录
	autoescape:true,         //是否自动escape编码
	cache:false,             //是否启用缓存
	ext:'.html'              //设置模板后缀
});
app.context.render=co.wrap(render);

let users=[{username:'张三'},{username:'李四'},{username:'王二麻'}]

//router.get('/user',(ctx,next)=>{
//	ctx.body=`<!DOCTYPE html>
//<html>
//	<head>
//		<meta charset="UTF-8">
//		<title></title>
//	</head>
//	<body>
//	<h1>hello</h1>
//	</body>
//</html>`
//});
router.get('/list',async (ctx,next)=>{
	ctx.body=await ctx.render('1.html',{users})
});

app.use(router.routes() );



app.listen(8080);