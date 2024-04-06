const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routers/userRoutes')
const taskRouter = require('./routers/taskRoutes')
const bodyParser = require('body-parser'); 


const app = express()

const PORT = process.env.PORT || 3000

// app.use((req, res, next)=>{
//     res.status(503).send("Service access Unavailable")  
// })


app.use(express.json())

app.use(userRouter)
app.use(taskRouter)
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));



mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',  {
    useNewUrlParser: true,
    useCreateIndex: true
})

app.get('/', async(req,res)=>{
    res.send("<h1>Nuv atu tirigi itu tirgi na dhagarikey vastav ani naku telsu 😏</h1>")
})

app.listen(PORT,()=>{
    console.log("Serve started")
})
