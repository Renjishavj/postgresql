const express = require("express");
const Pool = require('pg').Pool
require('dotenv').config()
const employeeRoute = require("./Route/employeeRoute")
const customerRoute =require("./Route/customerRoute")
const studentRoute =require("./Route/studentRoute")
const app = express();

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
  })
  pool.connect(function(err) {
    if (err) throw err;
    console.log("Db Connected");
  });
  
  app.use(express.json());
  app.use("/employee",employeeRoute);
  app.use("/customer",customerRoute);
  app.use("/student",studentRoute);

app.listen(3300, () => {
    console.log("Server is running on port 3300");
  });
