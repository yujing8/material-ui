const express = require('express');
const app = express();
//注册购物车路由模块
app.use('/api',require('./router/cart'));
//注册订单路由模块
app.use('/api',require('./router/order'));
//注册商品路由模块
app.use('/api',require('./router/goods'))
//注册会员路由模块
app.use('/api',require('./router/user'));
//注册商户路由模块
app.use('/api',require('./router/member'));
//注册支付路由模块
app.use('/api',require('./router/pay'));
//注册支付配置路由模块
app.use('/api',require('./router/payconfig'));
//注册结算路由模块
app.use('/api',require('./router/settlement'));
//注册个人中心模块
app.use('/api',require('./router/profile'));
const PORT = 8000;
app.listen(PORT, console.log(`服务器在${PORT}端口号运行`));
