// 包装过的http
var koa = require('koa');


// 创建一个http服务器，监听请求。类似 http.creatServer
var server = new koa();

// 服务端：接收请求（request）---通过use方法注册中间件---把中间件处理好的数据发送出去
// 我们只需要处理【通过use方法注册中间件】



// 这就相当于一个优美的中间件
server.use((ctx, next) => {
    // ctx，koa处理好的一个对象
    console.log(1)
    ctx.body = "<h1>hello";
    // next-迭代器，就能执行下一个 use 了
    next();
})

server.use((ctx, next) => {
    // ctx，koa处理好的一个对象
    console.log(2)
    ctx.body += " boy<h1>"
})

// 监听当前主机端口
server.listen(8088);
