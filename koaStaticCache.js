var koa=require('koa');
var koaStaticCache=require('koa-static-cache');

var app=new koa();


app.use(koaStaticCache(__dirname+'/static',{
	prefix:'/public'
}));


app.use(koaStaticCache(__dirname+'/static/img',{
	prefix:'/img'
}));
app.use((ctx,next)=>{
	//ctx.body="hello"
});

app.listen(8080);
