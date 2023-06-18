const prisma = require('./client');

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

/**用户登录 */
router.post('/member/login', (req, res) => {
    //将 req.body 请求体中的数据 转存为 userinfo 常量
    const userinfo = req.query;
    //登录失败
    async function query() {
        const member = await prisma.member.findFirst({
            where: {
                loginAccount: userinfo.account,
                loginPassword: userinfo.password
            }
        });
        if (member !== null) {
            //const secretKey = 'secretkey';
            const tokenStr = jwt.sign({ loginAccount: userinfo.account }, secretKEY, { expiresIn: '8h' });

            res.send({
                code: 200,
                msg: '登录成功',
                data: member,
                token: tokenStr //要发送给客户端的token字符串
            })

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

/** 验证是否已登录*/
router.get('/isLogin', (req, res) => {
    const token = req.headers['authorization'];
    let loginAccount;
    const x = jwt.verify(token, secretKEY, function (err, decoded) {
        if (decoded) {
            loginAccount = decoded.loginAccount;
        }

        if (err) return false;
        return true;
    });

    if (x) {
        async function query() {
            const member = await prisma.member.findFirst({
                where: {
                    loginAccount: loginAccount
                }
            });
            res.json({ code: 200, data: member });
        }
        query().then(async () => {
            await prisma.$disconnect()
        })
            .catch(async (e) => {
                console.error(e)
                await prisma.$disconnect()
                process.exit(1)
            });


    } else {
        res.json({ code: 404 });
    }

});

/**获取所有会员信息 */
router.post('/members', (req, res) => {
    // let token = req.headers['authorization'];
    // if (!token) return res.send({ code: 404, msg: '请重新登录' });
    // let authjwt = jwt.verify(token, secretKEY, function (err, decoded) {
    //     if (err) return false;
    //     return true;
    // });

    async function query() {
        const member = await prisma.member.findMany({
            where: {
                userName: {
                    contains: req.body.userName
                },
                userEmail: {
                    contains: req.body.userEmail
                },
                loginAccount: {
                    contains: req.body.loginAccount
                }
            }
        });
        
        res.send({ code: 200, data: member })
    }

    query();
    // if (authjwt) {
    //     query().then(async () => {
    //         await prisma.$disconnect()
    //     })
    //         .catch(async (e) => {
    //             console.error(e)
    //             await prisma.$disconnect()
    //             process.exit(1)
    //         })
    // } else {
    //     res.send({ code: 404, msg: 'token过期' });
    // }

  

});

/**新增会员 */
router.post('/member/add', (req, res) => {
    let obj = req.body;
    obj.loginPassword = md5(obj.loginPassword);
    obj.avatar && savePic(obj);
    async function insert() {
        const member = await prisma.member.create({
            data: obj,
        })
        res.send({ code: 200, msg: 'insert success', data: member })
    }
    insert().then(async () => {
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })

});
/**修改会员 */
router.post('/member/update', async (req, res) => {
    let obj = req.body;
    obj.loginPassword.length !== 32 ? obj.loginPassword = md5(obj.loginPassword) : null;
    if (obj.avatar !== undefined && obj.avatar.length > 0) {
        savePic(obj);
    } else {
        delete obj.avatar;
    }

    try {
        const member = await prisma.member.update({
            where: {
                loginAccount: obj.loginAccount
            },
            data: obj,
        })
        res.send({ code: 200, msg: 'update success', data: member })
    } catch (error) {
        console.log(error);
        res.send({ code: 404, msg: 'update error' })
    }
});

/**删除会员 */
router.post('/member/delete', async (req, res) => {
    try {
        await prisma.member.delete({
            where: {
                id: req.body.id
            }
        });
        res.send({ code: 200, msg: 'delete success' })
    } catch (error) {
        res.send(error);
    }
});

/**批量删除会员 */
router.post('/members/delete', async (req, res) => {
    try {
        await prisma.member.deleteMany({
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

/**查询会员 */
router.post('/members/query', async (req, res) => {
    try {
        let data = await prisma.member.findMany({
            where: {
                userName: {
                    contains: req.body.userName
                },
                userEmail: {
                    contains: req.body.userEmail
                },
                loginAccount: {
                    contains: req.body.loginAccount
                }
            }
        });
        res.send({ code: 200, msg: 'query success', data })
    } catch (error) {
        res.send(error);
    }
});

/**保存图片 */
const savePic = (obj) => {
    const name = obj.avatar[0].name.split('.')[1];
    const base64 = obj.avatar[0].thumbUrl.replace(/^data:image\/\w+;base64,/, "");
    const filename = `${Date.now()}.${name}`;
    const path = 'http://localhost:8000/upload/' + filename;
    const avatarPath = (`${__dirname.replace('\\router', '')}/image/${filename}`);
    obj.avatar = path;
    const dataBuffer = new Buffer.from(base64, 'base64')
    fs.writeFile(avatarPath, dataBuffer, function (err) {//用fs写入文件
        if (err) {
            console.log(err);
        } else {
            console.log('写入成功！');
        }
    })

}
/**获取图片 */
router.get('/upload/:url', function (req, res) {
    res.sendFile(__dirname.replace('\\router', '') + "/image/" + req.params.url);
});

module.exports = router;