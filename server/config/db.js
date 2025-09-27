const mysql = require("mysql2");
require("dotenv").config({ path: ".env" });

const db = mysql.createConnection({
  host: process.env.Server_Host,
  port:process.env.Server_Port,
  user: process.env.Server_Username,
  password: process.env.Password,
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
