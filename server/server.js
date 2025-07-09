const express= require('express');
const app=express();
const port=process.env.PORT||5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config();   //to use environment variables from .env file
const dbConfig=require('./config/dbConfig'); //to connect to the database



//registration route
const userRoute=require('./routes/userRoute'); //importing the user route
app.use("/api/users",userRoute);



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
