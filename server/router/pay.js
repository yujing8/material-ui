const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
const AlipaySdk = require('alipay-sdk').default;
//引入支付宝配置文件
const alipaySdk = new AlipaySdk({
  appId: '2021000122685240',
  //签名算法
  signType: 'RSA2',
  //支付宝公钥
  alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArza2YkZGrOkilWIioaKFwBZeha0F/q3+F/SCovvNB/xYDLcbIF0P/S4hE2FdWNfvy8QBodn9j5VMTpluxg1gOTCkyQOTtbVZhUg2lHDjyX0tC177uZaYVp6ORC3SfAe4EA5X37Ev+5CzE6Lb1Idc2/R8Yt3kgmGG2001ihiZNGHjVx/7stXX+OBA2myRVAhn0mKOkHN/RB5T40tNCDL29kRfeaFfd9cd2QuGBxTPS1zSLRlzTeogtCJZfZKAfVFByCyE0xnu5qi5m5RP0J/D9afZlAjjuLGI+rvxe2Bx7Uq1nPZhuYS9jtrDQVY/F5JlHVBRtR6WL6cD21rh8UNFqQIDAQAB',
  //应用私钥
  privateKey: 'MIIEpAIBAAKCAQEAnJ9WT5bRGG2+QrpsL4Po03fnfNmxFOH66ik5uZUmC2p/7nt0+bOOoBL548rkyPP9Eiv5KB9bqJ0Hcfjx4xaBmlUzPtBri6EbkVQM1KsEA3sN5hpPGmkEkgoROimEYMAo/fr6sJnEsQwJtyM3raqwH8W+WzEkMMB2arvrFtAwgFCJeWfAmnJjH/yCThe+l6krvDhatk3DE8UWmuTGk9orOWJSrS8y1rVtF42KsXcndMTc8yYFPGZ666j45xYewd/NsL5NSscs20M8XPwO0jFsMqBpbn8CBJJKiKyGl0nPab7RZW+maS7if0lwmFT6u4A5PjEJRSAhkNWsxaG8pXPYTQIDAQABAoIBAFZSGyfSX3uvQGVWibnGYdPrCdJtyINR6RCVmBMIeOdh0xCFSns00y62RrOdZ2q5zojtY20Rm1ra8PeH1QjrppKA0rWT+TIDoUX/pPKxLo0cjRR8+4v6xWIX2lbL+wG35t/UK8aZeSZ7E/+zkUROBrP8MGXiN6gG6zz4RSFVrOWKoEOUGuvhaW0/5UGAIgk126Jl0w0kx/ZTL5IAvlyHUCcHZhbrKOQq3nUj79Jsl8YcdJX6LZRbM+V/DXg/J7RxWZ5qllqxq2UjxmuG0HFWPBKsHJPRlfvErL7oucAiwCRkjf3Y+0h3zCeBm6wn9KUrAT1vWrNQQxihK+nRNv3VAKECgYEA2Vah/8dlX1FuUp/ax2OBgQwCdumW1Iv7Q+g71FdVhNpKZqnkome2O4JwLRFKrAduoIrVqZqijjzCeVCuvng8C7W6+iWfhpFvcfOlR7VPZDVQJU3pQfhOWe3an9ewu76LQXj5z+J21uSCJ0dIOsGQnhbuKxzUPMgUk62507Fdp4MCgYEAuHvCpTYwMBlVTGrlrfAdpzpSM3+pHhRhvKlb43UB+uw4/5YUE7LXCBP9+btqRPndrEJVb4s/+2uTo4pLQNm05RRT+ZQdzB2bdmMfIIcI1RELNgJvAup0Ew2Krn78IStd1+peo8UCoS8QhSac0ZLbqLOW1uGDlZFxD/GKWXPqp+8CgYEAkYO+jUmMpugXjHx497y4zZUj5Uf6c66ReeL4g/BBUuTwoZIogVAdI/TudE46h7mmKRkrexYMtl0Z/C24AdDwqwpu+OLNz0R6sHnn9H4BfN9xHLjwbvn4Q5/MG+9G5jzqcdi0sao31SNDvVatlqFY2XAS4Iy50URI+qN7YrBDO08CgYA9D9mxTWpNwVTWYlt7Ywqtm0Qx/4M+jYh8JaJgew4Yu69yCX7DtmIuLk/WJQ5bnkidB6e3r+ORmF3Zt6CI6oZRfJT++uOR+ArI+K4I2ik2PNn1GoEb+fZJiCXq8+UIJY5+NPj2Q/NG3okdSVaGl5FVGXxHy4T+MJG3sT8VtKRqyQKBgQCSZig2GKYUjFm+CHHkpjXNG/lFsBNSgNlxTRl3GGKU5CktPhFOg9BSd+Vq9MmdJcuuErC5jIOXRNcspGRQyDcsr2CGtWvazRJkzdu57mBOxdo71+85scr1sfel4+Vf13XVWxBkWhMuREFBSssdYzuB6vUIifjHO2XDBeD4YUHN1A==', // 传入私钥
  //支付宝网关
  gateway: "https://openapi.alipaydev.com/gateway.do" // 沙箱环境的请求网关与正式环境不一样，需要在此更改，如果是使用正式环境则去掉此处的设置

});
router.post('/member/pay', async (req, res, next) => {
  //订单号
  let id = req.body.order_id || JSON.parse(Object.keys(req.body)).order_id;
  //商品总价
  let price = req.body.total;
  //购买商品的名称
  let name = req.body.shipping_name;
  const bizContent = {
    out_trade_no: id,
    //价格
    total_amount: price,
    product_code: 'FAST_INSTANT_TRADE_PAY',
    //商品名称
    subject: name
  }

  const result = await alipaySdk.pageExec('alipay.trade.page.pay', {
    method: 'POST',
    bizContent,
    returnUrl: 'http://localhost:3000/paysuccess',
    notifyUrl: 'http://51ce80ca.r12.cpolar.top/api/member/paycallback'
  });
  res.send(result)
})

router.use(bodyParser.urlencoded({
  type: function (req) {
    return /x-www-form-urlencoded/.test(req.headers['content-type']);
  },
  extended: true
}));
//支付异步回调
router.post('/member/paycallback', async(req, res) => {
  const signRes = alipaySdk.checkNotifySign(req.body);
  if (signRes) {
     //修改订单状态，改成已付款
     await prisma.orders.updateMany({
      where: {
        order_id: req.body.out_trade_no
      },
      data: {
        status: "2"
      }
    });
    res.send("success");
  } else {
    res.send("fail");
  }
})
//订单验证
router.post('/member/paycheck', async (req, res) => {
  //const out_trade_no=req.body.out_trade_no;
  const queryObj = {
    gmt_create: '2023-04-29 19:54:50',
    charset: 'utf-8',
    gmt_payment: '2023-04-29 19:54:57',
    notify_time: '2023-04-29 19:55:00',
    subject: '红酒',
    sign: 'aKqsLTLJve7n1Q66LIQN2BdZYJlTqqzjO3+IHeASmOToNY9BXpo9nYj5PZWqOc22LqcJNouU+SybwjU3GtEn4f+uZLzP8eHvX06cqkuWqEvQMKrrC6NiOztFaVGmqDcSl5lhBBVfrn7um2H6AWQCnvrQIPX50Vw3c/Wu6L5jbjQ1zsv4A5kl0pg/J+l8Qxcn46UrIS8mHfCnM5sv6Z2Vg+3TCIwM1o7W5rrR/5CyOBjMv19Xd9Xxf3QenY86vqT34R1vBu9JzH0x90A5Dl/iCp2TepHMI0ejw7BtP/eCcGcFKb726S7m1dDmogxMq+HWvnvz6nRWXNNmxHdsD9+aUg==',
    buyer_id: '2088722012404633',
    invoice_amount: '168.00',
    version: '1.0',
    notify_id: '2023042900222195554004630526846870',
    fund_bill_list: '[{"amount":"168.00","fundChannel":"ALIPAYACCOUNT"}]',
    notify_type: 'trade_status_sync',
    out_trade_no: '4354312728963163',
    total_amount: '168.00',
    trade_status: 'TRADE_SUCCESS',
    trade_no: '2023042922001404630505776336',
    auth_app_id: '2021000122685240',
    receipt_amount: '168.00',
    point_amount: '0.00',
    app_id: '2021000122685240',
    buyer_pay_amount: '168.00',
    sign_type: 'RSA2',
    seller_id: '2088721012424887'
  }
  // true | false

  const signRes = await alipaySdk.checkNotifySign(queryObj);
  res.send({
    data: signRes
  })
});

module.exports = router;