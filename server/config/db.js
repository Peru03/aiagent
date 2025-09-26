const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
  port:4000,
  user: "GDDdnEwNZFkh5LU.root",
  password: "5YoYlCkUT11JhFpG",
  database: "reactadmin",
  ssl: {
    rejectUnauthorized: true
  }
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

module.exports = db;
