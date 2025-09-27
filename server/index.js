const express = require('express');
var cors = require('cors')
const bodyParser= require('body-parser');
const connectDB = require("./config/db");


require("dotenv").config({ path: ".env" });

const app = express();

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//All routes
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const assistantRouter = require("./routes/assistant");
const dashboard = require("./routes/dashboardRoutes")


// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/assistant", assistantRouter);
app.use("/api/dashboard", dashboard);




// Start server

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// const bcrypt = require("bcryptjs");
// bcrypt.hash("admin", 10).then(console.log);
