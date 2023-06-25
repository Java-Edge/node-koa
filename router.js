var koa=require('koa');
var koaRouter=require('koa-router');

var app=new koa();
var router=new koaRouter();

//app.use((ctx,next)=>{
//
//
//
////method:get//post//put//del//all
////http://127.0.0.1:8080/user/  添加用户
////http://127.0.0.1:8080/user/  查询用户
////http://127.0.0.1:8080/user/  删除用户
//
////这种写法也算是简单的路由
////	console.log(ctx.URL)
////	switch(ctx.URL){
////		case'/a'
////		break;
////		case'/b'
////		break;
////	}
//	
//})

//通过get方式发送请求

var userRouter=new koaRouter();


//user
//'/'=>'/uer'
//'/xxx'=>'/user/xxxx'

userRouter.get('/',(ctx,next)=>{
	ctx.body="user-get";
});
userRouter.get('/info',(ctx,next)=>{
	ctx.body="user/info-get";
});

router.use('/user',userRouter.routes());



var indexRouter=new koaRouter({
	prefix:'/index'
});

indexRouter.get('/',(ctx,next)=>{
	ctx.body="index-get";
});
indexRouter.get('/add',(ctx,next)=>{
	ctx.body="index/add-get";
});

//动态路由
var itemRouter=new koaRouter();
itemRouter.get('/item/:id',(ctx,next)=>{
	ctx.body="item"+ctx.params.id;
});


app.use(router.routes() );
app.use(indexRouter.routes() );
app.use(itemRouter.routes() );



app.listen(8080);