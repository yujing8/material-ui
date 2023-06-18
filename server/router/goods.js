/**商品路由模块 */
const prisma = require('./client');
const express = require('express');
const router = express.Router();
const fs = require('fs');
router.use(express.json());
//获取所有商品
router.get('/products', async (req, res) => {

  const goods = await prisma.goods.findMany({
    where: {
        name: {
            contains: req.query.name
        },
        category: {
            contains: req.query.category
        },
        price: {
            contains: req.query.price
        }
        
    }
});
  res.send(goods);
})
//获取单个商品
router.get('/products/:id', async (req, res) => {
  const goods = await prisma.goods.findUnique({
    where: {
      id: +req.params.id
    }
  });
  res.send(goods);
})
//添加商品信息
router.post("/goods/add", async (req, res) => {
  let obj = req.body;
  obj.image && savePic(obj);
  obj.countInStock = +obj.countInStock;
  const goods = await prisma.goods.create({
    data: obj,
  })
  res.send({ code: 200, msg: 'insert success' })
})
//删除商品信息
router.post('/goods/delete', async (req, res) => {
  let obj = req.query;
  const goods = await prisma.goods.delete({
    where: {
      id: +obj.id
    }
  });
  res.send({ code: 200, msg: 'delete success' })
})
//修改商品信息
router.post("/goods/update", async (req, res) => {
  let obj = req.body;
  obj.countInStock = +obj.countInStock;
  if (obj.image !== undefined && obj.image.length > 0) {
    savePic(obj);
  } else {
    delete obj.image;
  }
  const goods = await prisma.goods.update({
    where: {
      id: +obj.id
    },
    data: obj
  })
  res.send({ code: 200, msg: 'update success' })
})
//更新库存信息
router.post("/goods/stock", async (req, res) => {
  let obj = req.body;
  try {
    for (let key in obj) {
      await prisma.goods.update({
        where: {
          id: +key,
        },
        data: {
          countInStock: { increment: -obj[key] },
        }
      });
    }
  } catch (error) {
    res.send({ code: 404, msg: 'update error' })
  }

  res.send({ code: 200, msg: 'update success' })
})

/**保存图片 */
const savePic = (obj) => {
  const name = obj.image[0].name.split('.')[1];
  const base64 = obj.image[0].thumbUrl.replace(/^data:image\/\w+;base64,/, "");
  const filename = `${Date.now()}.${name}`;
  const path = 'http://localhost:8000/upload/' + filename;
  const imagePath = (`${__dirname.replace('\\router', '')}/image/${filename}`);
  obj.image = path;
  const dataBuffer = new Buffer.from(base64, 'base64')
  fs.writeFile(imagePath, dataBuffer, function (err) {//用fs写入文件
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