const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database("D:\\hl-agro\\server\\prisma\\dev.db");
module.exports = db;