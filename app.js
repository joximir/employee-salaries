const express = require('express')
const mysql = require('mysql')
const multer = require('multer')
require('dotenv').config()
const app = express()

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

app.use(express.static('public'))

app.post('/api/intro', multer().none(), (req, res)=>{
    const keys = Object.keys(req.body).join(",")
    const values = Object.values(req.body).join("','")
    db.query(`INSERT INTO employees (${keys}) VALUES ('${values}')`, (error, _) => {
        if (error) {
            console.log(error.sqlMessage)
            res.sendStatus(500)
        }
        else {
            db.query('SELECT DISTINCT company FROM employees', (err, companies) => {
                if (err) throw err
                res.send(companies.map(obj => obj.company))               
            })
        }
    })    
})

app.get('/api/companies/:company', (req, res) => {
    const pickedCompany = req.params.company.replace(/_/g, ' ')
    console.log(pickedCompany)
    db.query(`SELECT * FROM employees WHERE company = '${pickedCompany}'`, 
    (err, rows) => {
        if (err) {
            console.error(err.sqlMessage)
            res.sendStatus(500)
        }
        else {
            res.send(rows.map(({id, company, ...rest}) => rest))
        }
    })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
