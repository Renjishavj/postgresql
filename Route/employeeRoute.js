const express = require("express");
const router = express.Router();
const Pool = require('pg').Pool
require('dotenv').config()
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
  })
router.post("/insertemp",(request, response)=>{
    const {emp_name,emp_age,emp_phone,emp_salary} = request.body

    if (!emp_name || !emp_age || !emp_phone || !emp_salary) {
        return response.status(400).send("All fields are required");
      }

    pool.query('INSERT INTO employee (emp_name,emp_age,emp_phone,emp_salary) VALUES ($1, $2,$3,$4)', [emp_name,emp_age,emp_phone,emp_salary], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Employee added `)
    
    })
})
router.get("/allemp",(request,response)=>{
    pool.query('SELECT * FROM employee ', (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
})

router.get("/:emp_id",(request,response)=>{
    const emp_id = parseInt(request.params.emp_id)

    pool.query('SELECT * FROM employee WHERE emp_id = $1', [emp_id], (error, results) => {
      if (error) {
        throw error 
      
      }
      response.status(200).json(results.rows)
    })
})

router.put("/:emp_id",(request,response)=>{
    const emp_id=parseInt(request.params.emp_id)
    const {emp_name,emp_age,emp_phone,emp_salary} = request.body
    pool.query('UPDATE employee SET  emp_name=$1, emp_age=$2, emp_phone=$3, emp_salary=$4 WHERE emp_id=$5',
      [emp_name,emp_age,emp_phone,emp_salary,emp_id],

      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Employee modified with ID: ${emp_id}`)
      }  
    )
})

router.delete("/:emp_id",(request,response)=>{
    const emp_id=parseInt(request.params.emp_id)
    const {emp_name,emp_age,emp_phone,emp_salary}=request.body;
    pool.query('DELETE FROM employee WHERE emp_id=$1',[emp_id],
        (error,results)=>{
            if(error){
                throw error
            }
            response.status(200).send(`Employee deleted with ID: ${emp_id}`)
        }
     );
})



  module.exports = router;