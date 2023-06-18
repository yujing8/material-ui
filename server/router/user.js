/**用户路由模块 */
const prisma = require('./client');
const express = require('express');
const router = express.Router();
router.use(express.json());
/**登录请求 */
let jwt = require('jsonwebtoken');

//新增用户
router.post("/user", async (req, res) => {
    let obj = req.body;
    const user = await prisma.user.create({
        data: obj,
    })
    res.send({ code: 200, msg: 'insert success' })
})

//查询用户
router.post("/userquery", async (req, res) => {
    const { email, password } = req.body
    const user = await prisma.user.findFirst({
        where: {
            email: email,
            password: password
        }
    });
    if (user !== null) {
        let token = jwt.sign({ username: email }, 'jsonwebtoken', { expiresIn: '8h', algorithm: 'HS256' });
        res.send({ code: 200, data: user, token })
    } else {
        res.send({ code: 404 })
    }
})

module.exports = router;