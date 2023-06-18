/**购物车路由模块 */
const prisma = require('./client');
const express = require('express');
const router = express.Router();
router.use(express.json());
//添加商品到购物车
router.post('/carts', async (req, res) => {
    let obj = req.body;

    const flag =await prisma.cartlist.findFirst({
        where:{
            u_email: obj.u_email,
            goods_id: obj.goods_id + '',
            status:0
        }
    });
    if(!flag){
        await prisma.cartlist.create({
            data: {
                name: obj.name,
                price: obj.price,
                num: obj.num,
                u_email: obj.u_email,
                goods_id: obj.goods_id + ''
            },
        })
    
    }else{
        await prisma.cartlist.updateMany({
            where: {
                goods_id: obj.goods_id+''
            },
            data:{
                num: obj.num
            }
        });
    }

    res.send({ code: 200, msg: 'insert success' })

});

//根据用户名获取购物车信息
router.get('/carts/:u_email', async (req, res) => {
    const cartlist = await prisma.cartlist.findMany({
        where: {
            u_email: req.params.u_email,
            status:0
        }
    });
    res.send(cartlist)

})

//删除购物车商品
router.delete('/carts/:id', async (req, res) => {
    let obj = req.params;
    const cartlist = await prisma.cartlist.update({
        where: {
            id: +obj.id
        },
        data:{
            status:1
        }
    });
    res.send({ code: 200, msg: 'delete success' })
})

//根据用户删除购物车商品
router.get('/cart/:user', async (req, res) => {
    let obj = req.params;
   
    const cartlist = await prisma.cartlist.updateMany({
        where: {
            u_email: obj.user
        },
        data:{
            status:1
        }
    });
    res.send({ code: 200, msg: 'delete success' })
})

module.exports = router;