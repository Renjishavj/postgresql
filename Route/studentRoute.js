const express = require("express");
const router = express.Router();
const Pool = require('pg').Pool
const bcrypt = require('bcrypt');
require('dotenv').config()
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
  })
router.post("/signup",async (request,response)=>{
    
    const { std_name, std_email, std_pass } = request.body;
    if (!std_name || !std_email || !std_pass ) {
        return response.status(400).send("All fields are required");
        
      }

   const hashedPassword = await bcrypt.hash(std_pass, 10);

   

  pool.query('INSERT INTO student (std_name,std_pass,std_email) VALUES ($1, $2,$3)', [std_name,hashedPassword,std_email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Student added `)
  
  })
})

router.post("/login",async (request,response)=>{
    const { std_email, std_pass } = request.body;
    
    pool.query('SELECT * FROM student WHERE std_email = $1', [std_email], async (error, results) => {
        if (error) {
            throw error;

        }
        const student = results.rows[0];
        const isPasswordValid = await bcrypt.compare(std_pass, student.std_pass);
        if (!isPasswordValid) {
            return response.status(401).send("Invalid email or password");
        }

        response.status(200).send("Login successful");
    });
})

module.exports = router;