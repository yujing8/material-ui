const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//导入用于生成JWT字符串的包
const jwt = require('jsonwebtoken');
//密码加密
const md5 = require('blueimp-md5');
const fs = require('fs');
const express = require('express');
const router = express.Router();
router.use(express.json());
// 密钥
const secretKEY = 'secretKEY';

/**查询所有支付配置信息 */
router.post('/paymentconfigs', async (req, res) => {
    try {
        let data = await prisma.PaymentSdk.findMany({
            where: {
                payWay: {
                    contains: req.body.payWay
                },
                appId: {
                    contains: req.body.appId
                },
                signType: {
                    contains: req.body.signType
                }
            }
        });
        res.send({ code: 200, msg: 'query success', data })
    } catch (error) {
        res.send(error);
    }
});
//新增支付配置
router.post('/paymentconfig/add', async (req, res) => {
    let obj = req.body;
    try {
        const payment = await prisma.PaymentSdk.create({
            data: obj,
        })
        res.send({ code: 200, msg: 'insert success', data: payment });
    } catch (error) {
        console.log(error);
        res.send({ code: 404, msg: 'insert error' })
    }
});

//修改支付配置
router.post('/paymentconfig/update', async (req, res) => {
    let obj = req.body;
    try {
        const payment = await prisma.PaymentSdk.update({
            where: {
                id: obj.id
            },
            data: obj,
        })
        res.send({ code: 200, msg: 'update success', data: payment });
    } catch (error) {
        console.log(error);
        res.send({ code: 404, msg: 'update error' })
    }
});

//删除支付配置
router.post('/paymentconfig/delete', async (req, res) => {
    try {
        await prisma.PaymentSdk.delete({
            where: {
                id: req.body.id
            }
        });
        res.send({ code: 200, msg: 'delete success' })
    } catch (error) {
        res.send(error);
    }
});
//批量删除支付配置
router.post('/paymentconfigs/delete', async (req, res) => {
    try {
        await prisma.PaymentSdk.deleteMany({
            where: {
                id: {
                    in: req.body.ids
                }
            }
        });
        res.send({ code: 200, msg: 'delete success' })
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;