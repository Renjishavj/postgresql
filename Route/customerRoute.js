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


router.post("/insertcust",(request, response)=>{
    const {cust_name,cust_age,cust_phone} = request.body

    if (!cust_name || !cust_age || !cust_phone ) {
        return response.status(400).send("All fields are required");
      }

    pool.query('INSERT INTO customer (cust_name,cust_age,cust_phone) VALUES ($1, $2,$3)', [cust_name,cust_age,cust_phone], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`customer added `)
    
    })
})

router.get("/allcust",(request,response)=>{
    pool.query('SELECT * FROM customer ', (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
})


router.get("/:cust_id",(request,response)=>{
    const cust_id = parseInt(request.params.cust_id)

    pool.query('SELECT * FROM customer WHERE cust_id = $1', [cust_id], (error, results) => {
      if (error) {
        throw error 
      }
      response.status(200).json(results.rows)
    })
})

router.put("/:cust_id",(request,response)=>{
    const cust_id=parseInt(request.params.cust_id)
    const {cust_name,cust_age,cust_phone} = request.body
    pool.query('UPDATE customer SET  cust_name=$1, cust_age=$2, cust_phone=$3 WHERE cust_id=$4',
      [cust_name,cust_age,cust_phone,cust_id],

      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Customer modified with ID: ${cust_id}`)
      }  
    )
})

router.delete("/:cust_id",(request,response)=>{
    const cust_id=parseInt(request.params.cust_id)
    const {cust_name,cust_age,cust_phone}=request.body;
    pool.query('DELETE FROM customer WHERE cust_id=$1',[cust_id],
        (error,results)=>{
            if(error){
                throw err
            }
            response.status(200).send(`Customer deleted with ID: ${cust_id}`)
        }
     );
})

router.post("/customer", async (req, res) => {
  const { emp_id,cust_name,cust_age,cust_phone } = req.body;

  if (!emp_id || !cust_name || !cust_age || !cust_phone) {
      return res.status(400).send("All fields are required");
  }

  try {
      
      const employeeResult = await pool.query('SELECT emp_id FROM employee WHERE emp_id = $1', [emp_id]);
      if (employeeResult.rows.length === 0) {
          return res.status(400).send("Invalid Employee");
      }

      
      await pool.query('INSERT INTO customer (emp_id, cust_name, cust_age, cust_phone) VALUES ($1, $2, $3, $4)', 
                       [emp_id, cust_name, cust_age, cust_phone]);
      
      res.status(201).send("Customer created");
  } catch (error) {
      res.status(500).send("error");
  }
});

router.get("/emp/:emp_id",(request,response)=>{
  const emp_id = parseInt(request.params.emp_id)

  pool.query('SELECT * FROM customer WHERE emp_id = $1', [emp_id], (error, results) => {
    if (error) {
      throw error 
    }
    response.status(200).json(results.rows)
  })
})

module.exports = router;