-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT,
    "userName" TEXT,
    "userEmail" TEXT,
    "loginAccount" TEXT,
    "loginPassword" TEXT,
    "payAccount" TEXT,
    "phone" TEXT,
    "avatar" TEXT DEFAULT 'https://img1.baidu.com/it/u=307074048,654359288&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500',
    "status" INTEGER NOT NULL DEFAULT 0,
    "delFlag" INTEGER NOT NULL DEFAULT 0,
    "loginIp" TEXT,
    "loginTime" TEXT,
    "createBy" TEXT,
    "createTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateBy" TEXT,
    "updateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PaymentSdk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appId" TEXT NOT NULL,
    "payWay" TEXT NOT NULL DEFAULT '支付宝',
    "signType" TEXT NOT NULL DEFAULT 'RSA2',
    "payPublicKey" TEXT NOT NULL DEFAULT '',
    "privateKey" TEXT NOT NULL DEFAULT '',
    "gateway" TEXT NOT NULL DEFAULT '',
    "returnUrl" TEXT NOT NULL DEFAULT '',
    "notifyUrl" TEXT NOT NULL DEFAULT '',
    "createTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "settlementId" TEXT NOT NULL,
    "settlementMonth" TEXT NOT NULL DEFAULT '',
    "merchantId" TEXT NOT NULL DEFAULT '',
    "merchantName" TEXT NOT NULL DEFAULT '',
    "settlementMoney" TEXT NOT NULL DEFAULT '',
    "settlementWay" TEXT NOT NULL DEFAULT '',
    "settlementChannel" TEXT NOT NULL DEFAULT '',
    "settlementDocState" TEXT NOT NULL DEFAULT '',
    "settlementState" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "createTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settlementTime" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "Goods" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "brand" TEXT,
    "category" TEXT,
    "price" TEXT,
    "countInStock" INTEGER NOT NULL DEFAULT 0,
    "numReviews" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "address" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "role" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT DEFAULT '0'
);

-- CreateTable
CREATE TABLE "Cartlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "price" TEXT,
    "num" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 0,
    "u_email" TEXT,
    "goods_id" TEXT
);

-- CreateTable
CREATE TABLE "Orders" (
    "order_id" TEXT NOT NULL,
    "payment_type" TEXT,
    "status" TEXT NOT NULL DEFAULT '1',
    "total" TEXT,
    "create_time" TEXT,
    "shipping_name" TEXT,
    "user_id" TEXT,
    "address" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pId" INTEGER NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "avatar" TEXT,
    "birthday" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phoneNumber" TEXT,
    "sex" TEXT,
    "website" TEXT,
    "createTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Profile_pId_fkey" FOREIGN KEY ("pId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserAddr" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pId" INTEGER NOT NULL,
    "name" TEXT,
    "phoneNumber" TEXT,
    "provincialAndUrbanAreas" TEXT,
    "address" TEXT,
    "fullAddr" TEXT,
    "isDefaultAddr" BOOLEAN NOT NULL DEFAULT false,
    "status" INTEGER,
    "createTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAddr_pId_fkey" FOREIGN KEY ("pId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PayAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pId" INTEGER NOT NULL,
    "bankName" TEXT,
    "cardType" TEXT,
    "bankNumber" TEXT,
    "accountName" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "status" INTEGER,
    "createTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PayAccount_pId_fkey" FOREIGN KEY ("pId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AlipaySdk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appId" TEXT NOT NULL,
    "signType" TEXT NOT NULL DEFAULT 'RSA2',
    "alipayPublicKey" TEXT NOT NULL DEFAULT '',
    "privateKey" TEXT NOT NULL DEFAULT '',
    "gateway" TEXT NOT NULL DEFAULT '',
    "returnUrl" TEXT NOT NULL DEFAULT '',
    "notifyUrl" TEXT NOT NULL DEFAULT '',
    "createTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_loginAccount_key" ON "Member"("loginAccount");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentSdk_appId_key" ON "PaymentSdk"("appId");

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_settlementId_key" ON "Settlement"("settlementId");

-- CreateIndex
CREATE UNIQUE INDEX "Goods_name_key" ON "Goods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_order_id_key" ON "Orders"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_pId_key" ON "Profile"("pId");

-- CreateIndex
CREATE UNIQUE INDEX "AlipaySdk_appId_key" ON "AlipaySdk"("appId");
