let { expressjwt } = require('express-jwt');
const express = require('express');
const router = express.Router();
router.use(expressjwt({
    secret: 'jsonwebtoken',
    algorithms: ['HS256']
}).unless({
    
path: ["/","/api/user","/api/carts","/upload/img", "/api/orders/add","/api/member/paycallback","/api/member/pay","/api/userquery","/api/products", 
{ url: /^\/api\/products\/.*/, methods: ['GET'] }, 
{ url: /^\/upload\/.*/, methods: ['GET', 'PUT'] }, 
{ url: /^\/api\/carts\/.*/ }
]
})
);
module.exports = router;