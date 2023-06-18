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

//根据商户Id获取信息
router.post('/settlement/id', async (req, res) => {
   
    try {
        let data = await prisma.Settlement.findMany({
            where: {
                merchantId: req.body.merchantId
            }
        });
        res.send({ code: 200, msg: 'query success', data })
    } catch (error) {
        res.send(error);
    }
});

/**查询所有结算管理信息 '2023-06-13T14:21:00+0200'*/
router.post('/settlements', async (req, res) => {
    start_time = req.body.start_time == undefined ? '1970-05-02T13:34:06.000Z' : req.body.start_time;
   end_time = req.body.end_time == undefined ? '2170-05-02T13:34:06.000Z' : req.body.end_time;
    try {
        let data = await prisma.Settlement.findMany({
            where: {
                settlementId: {
                    contains: req.body.settlementId
                },
                settlementMonth: {
                    contains: req.body.settlementMonth
                },
                merchantId: {
                    contains: req.body.merchantId
                },
                merchantName: {
                    contains: req.body.merchantName
                },
                createTime: {
                    lte: new Date(end_time),
                    gte: new Date(start_time)
                }
                
            }
        });
        res.send({ code: 200, msg: 'query success', data })
    } catch (error) {
        res.send(error);
    }
});
//新增结算管理
router.post('/settlement/add', async (req, res) => {
    let obj = req.body;
    try {
        const payment = await prisma.Settlement.create({
            data: obj,
        })
        res.send({ code: 200, msg: 'insert success', data: payment });
    } catch (error) {
        console.log(error);
        res.send({ code: 404, msg: 'insert error' })
    }
});

//修改结算管理
router.post('/settlement/update', async (req, res) => {
    let obj = req.body;
    try {
        const payment = await prisma.Settlement.update({
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

//删除结算
router.post('/settlement/delete', async (req, res) => {
    try {
        await prisma.Settlement.delete({
            where: {
                id: req.body.id
            }
        });
        res.send({ code: 200, msg: 'delete success' })
    } catch (error) {
        res.send(error);
    }
});
//批量删除结算
router.post('/settlements/delete', async (req, res) => {
    try {
        await prisma.Settlement.deleteMany({
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