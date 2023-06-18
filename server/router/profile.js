/**profile路由模块 */
const prisma = require('./client');
const express = require('express');
const router = express.Router();
const moment = require('moment'); //时间格式化

router.post("/profile/getProfile", (req, res) => {
    const { id } = req.body
    async function query() {
        const profile = await prisma.profile.findUnique({
            where: {
                pId: id
            }
        });
        if (profile !== null) {
            res.send({ code: 200, data: profile })
        } else {
            res.send({ code: 404 })
        }
    }
    query().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})

router.post("/profile/updateProfile", (req, res) => {
    //获取post传递的数据 
    let obj = req.body;
    async function update() {
        const profile = await prisma.profile.update({
            where: {
                id: obj.id
            },
            data: obj,
        })
        res.send({ code: 200, msg: 'update success' })
    }
    update().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})

router.post("/profile/insertProfile", (req, res) => {
    //获取post传递的数据
    let obj = req.body;
    async function insert() {
        const profile = await prisma.profile.create({
            data: obj,
        })
        res.send({ code: 200, msg: 'insert success' })
    }
    insert().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})

//获取订单list
router.post('/profile/listOrder', (req, res) => {
    let obj = req.body + '';
    async function query() {
        const list = await prisma.orders.findMany({
            where: {
                user_id: obj.id,
            }
        })
        res.send(list)
    }
    query().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})

router.post('/profile/listAddr', (req, res) => {
    let obj = req.body;
    async function query() {
        const listAddr = await prisma.userAddr.findMany({
            where: {
                pId: +obj.id,
            },
            orderBy: [
                {
                    isDefaultAddr: 'desc',
                },
            ],
        })
        const modifiedListAddr = listAddr.map((addr) => ({
            ...addr,
            provincialAndUrbanAreas: JSON.parse(addr.provincialAndUrbanAreas ? addr.provincialAndUrbanAreas : null),
        }));
        res.send(modifiedListAddr)
    }
    query().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})

router.post("/profile/addAddr", (req, res) => {
    //获取post传递的数据
    let obj = req.body;
    obj.provincialAndUrbanAreas = JSON.stringify(obj.provincialAndUrbanAreas);
    async function insert() {
        const userAddr = await prisma.userAddr.create({
            data: obj,
        })
        res.send({ code: 200, msg: 'insert success' })
    }
    insert().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})

router.post("/profile/editAddr", (req, res) => {
    //获取post传递的数据 
    let obj = req.body;
    obj.provincialAndUrbanAreas = JSON.stringify(obj.provincialAndUrbanAreas);
    async function update() {
        const userAddr = await prisma.userAddr.update({
            where: {
                id: obj.id
            },
            data: obj,
        })
        res.send({ code: 200, msg: 'update success' })
    }
    update().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})

router.post("/profile/editAddrByPId", (req, res) => {
    //获取post传递的数据 
    let obj = req.body;
    async function update() {
        const userAddr = await prisma.userAddr.updateMany({
            where: {
                pId: obj.pId
            },
            data: {
                isDefaultAddr: false
            },
        })
        res.send({ code: 200, msg: 'update success' })
    }
    update().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})

router.post("/profile/delAddr", (req, res) => {
    //获取路由传参的数据
    let obj = req.body;
    async function del() {
        const userAddr = await prisma.userAddr.delete({
            where: {
                id: obj.id
            }
        });
        res.send({ code: 200, msg: 'delete success' })
    }
    del().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})


router.post('/profile/listPayAccount', (req, res) => {
    let obj = req.body;
    async function query() {
        const listPayAccount = await prisma.payAccount.findMany({
            where: {
                pId: obj.id,
            }
        })
        res.send(listPayAccount)
    }
    query().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})
router.post("/profile/addPayAccount", (req, res) => {
    //获取post传递的数据
    let obj = req.body;
    async function insert() {
        const payAccount = await prisma.payAccount.create({
            data: obj,
        })
        res.send({ code: 200, msg: 'insert success' })
    }
    insert().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})
router.post("/profile/editPayAccount", (req, res) => {
    //获取post传递的数据 
    let obj = req.body;
    async function update() {
        const payAccount = await prisma.payAccount.update({
            where: {
                id: obj.id
            },
            data: obj,
        })
        res.send({ code: 200, msg: 'update success' })
    }
    update().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})
router.post("/profile/delPayAccount", (req, res) => {
    //获取路由传参的数据
    let obj = req.body;
    async function del() {
        const payAccount = await prisma.payAccount.delete({
            where: {
                id: obj.id
            }
        });
        res.send({ code: 200, msg: 'delete success' })
    }
    del().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })

})

router.post("/profile/editPassword", (req, res) => {
    //获取post传递的数据 
    let obj = req.body;
    async function update() {
        const user = await prisma.user.update({
            where: {
                id: obj.id
            },
            data: {
                password: obj.password
            }
        })
        res.send({ code: 200, msg: 'update success' })
    }
    update().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})
router.post("/profile/delAccount", (req, res) => {
    //获取post传递的数据 
    let obj = req.body;
    async function update() {
        const user = await prisma.user.update({
            where: {
                id: obj.id
            },
            data: {
                status: "1"
            }
        })
        res.send({ code: 200, msg: 'update success' })
    }
    update().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
})


module.exports = router;