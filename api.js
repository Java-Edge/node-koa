// 包装过的http
var koa = require('koa');

// application-context-request、response

var app = new koa();

app.use((ctx, next) => {
    // throw new Error();
    // let a=1;
    // 不推荐这么写，可能覆盖ctx原有的值，推荐利用 state 机制将数据挂载到ctx 的 state 下
    // ctx.a=a;
    // ctx.state.a=a
    // next();

    //ctx.throw(500, "出错了", {a:1})
    //console.log(ctx.request)
    ctx.response.body = {a: 1, b: 2}
});
app.use((ctx, next) => {
    //throw new Error();
    //console.log(ctx.a)
    //console.log(ctx.state.a)
});
app.on('error', err => {
    console.log(err)
});

//监听当前主机端口
app.listen(8088);
