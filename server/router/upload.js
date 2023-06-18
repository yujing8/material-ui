/**图片上传路由模块 */
const prisma = require('./client');
const express = require('express');
const multer = require('multer');
const router = express.Router();
//设置图片存入位置
const storage = multer.diskStorage({
    destination(req, res, cb) {
        cb(null, 'upload/');
    },
    filename(req, file, cb) {
        const filenameArr = file.originalname.split('.');
        cb(null, Date.now() + '.' + filenameArr[filenameArr.length - 1]);
    }
});
const upload = multer({ storage });
//上传图片
router.post('/upload/img', upload.single('file'), (req, res) => {
    res.send({ code: 200, filename: req.file.filename });
});

//获取图片
router.get('/upload/:url', function (req, res) {
    console.log(__dirname.replace('\\router', '') + "/image/" + req.params.url);
    res.sendFile(__dirname.replace('\\router', '') + "/image/" + req.params.url);
});

module.exports = router;