const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const authRoutes = require('./routers/authRoutes')

const DBconnect = (async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to DB')
    } catch(error) {
        console.error('Cannot connect to DB')
    }
})

DBconnect();

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/auth',authRoutes)

app.use((err,req,res,next) => {
    res.status(500).json({message: err.message});
})

app.listen(process.env.PORT,() => {
    console.log("Connected to server");
})