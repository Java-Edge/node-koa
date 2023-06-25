var koa = require('koa');
var Router = require('koa-router');
var koaSwig = require('koa-swig');
var co = require('co');
var koaStaticCache = require('koa-static-cache');
var bodyParser = require('koa-bodyparser');

var router = new Router();
var app = new koa();

//处理请求正文中的数据
app.use(bodyParser());

// 静态文件处理
app.use(koaStaticCache('./static', {
    prefix: '/static',
    gzip: true
}))

//数据存储在当前运行服务器的内存中
let datas = {
    maxId: 3,
    appName: "JavaEdge的待办列表项目",
    color: 'index.css',
    list: [{id: 1, name: "铅笔", number: 12, price: 1},
        {id: 2, name: "笔记本", number: 4, price: 2},
        {id: 3, name: "橡皮", number: 0, price: 0.5}]
};


/**
 * 设置Koa应用程序的模板引擎
 */
app.context.render = co.wrap(koaSwig({
    // 设置模板文件夹的根目录
    root: __dirname + '/view',
    // 是否开启对HTML的转义功能 防止恶意脚本注入
    autoescape: true,
    // 是否开启模板缓存功能，可选项为false或memory
    cache: false,
    // 设置模板文件的扩展名
    ext: 'html'
}));


// 定义一个首页路由
router.get('/', async ctx => {
    // 在响应中渲染 index.html 模板，并将 datas 作为参数传递给模板引擎
    ctx.body = await ctx.render('index.html', {datas})
    // 输出 index.html 模板渲染后的结果到控制台
    // console.log(await ctx.render('index.html'))
});

// 添加
router.get('/add', async ctx => {
    ctx.body = await ctx.render('add.html', {appName: datas.appName})
});
// 处理提交上来的添加的商品数据
router.get('/postData', ctx => {
    let name = ctx.query.name;
    let price = ctx.query.price;
    let number = ctx.query.number;
    ctx.body = "获取到数据：" + name + "-" + price + "-" + number
});
router.post('/postData', async ctx => {
//	let name=ctx.request.body.name;
//	let price=ctx.request.body.price;
//	let number=ctx.request.body.number;
//	ctx.body="通过post获取到数据："+name+"-"+price+"-"+number;
    datas.list.push({
        id: ++datas.maxId,
        name: ctx.request.body.name,
        price: ctx.request.body.price,
        number: ctx.request.body.number
    });
    ctx.body = await ctx.render('message.html', {
        appName: datas.appName,
        msg: "添加成功",
        href: "/"
    })
});

//修改
router.get('/change/:id', async ctx => {
    let commodity = {};
    datas.list.forEach(item => {
        if (item.id == ctx.params.id) {
            commodity = item;
        }
    })
    ctx.body = await ctx.render('change.html', {appName: datas.appName, datas: commodity})
});

//修改数据
router.post('/changeInfo/:id', async ctx => {
    //ctx.body=ctx.params.id
//	let name=ctx.request.body.name;
//	let price=ctx.request.body.price;
//	let number=ctx.request.body.number;
//	ctx.body="通过post获取到数据："+name+"-"+price+"-"+number;
    for (var i = 0; i < datas.list.length; i++) {
        if (datas.list[i].id == ctx.params.id) {
            datas.list[i] = {
                id: ctx.params.id,
                name: ctx.request.body.name,
                price: ctx.request.body.price,
                number: ctx.request.body.number
            };
        }
    }
    ;
    ctx.body = await ctx.render('message.html', {
        appName: datas.appName,
        msg: "修改成功",
        href: "/"
    })
});

//删除
router.get('/remove/:id', async ctx => {
    datas.list = datas.list.filter(item => item.id != ctx.params.id);
    ctx.body = await ctx.render('message.html', {
        appName: datas.appName,
        msg: "删除成功",
        href: "/"
    })
});

app.use(router.routes());

app.listen(8084);
