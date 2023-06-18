/**订单路由模块 */
const prisma = require('./client');
const express = require('express');
const router = express.Router();
//时间格式化
const moment = require('moment');
//添加订单
router.post("/orders/add", async (req, res) => {
    let obj = req.body;
   
    obj.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
        //更新库存数量
        let cartNum = JSON.parse(obj.cartNum)
       
        for (let key in cartNum) {
          
            await prisma.goods.update({
                where: {
                    id: +key,
                },
                data: {
                    countInStock: { increment: -cartNum[key] },
                }
            });
        }

        delete obj.cartNum;
        const orders = await prisma.orders.create({
            data: obj,
        })
        //修改购物车商品状态
        const cart = await prisma.cartlist.updateMany({
            where: {
                u_email: obj.user_id
            },
            data: {
                status: 1
            }
        });

        res.send({ code: 200, msg: 'insert success' })
    } catch (error) {
        res.send({ code: 404, msg: 'insert error' })
    }


})

//获取订单信息
router.get("/orders/:user_id", async (req, res) => {
    const orders = await prisma.orders.findMany({
        where: {
            user_id: req.params.user_id
        }
    });
    res.send(orders)
})

module.exports = router;