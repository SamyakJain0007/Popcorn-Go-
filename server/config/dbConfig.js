//MongoDB connection ka code
const mongoose=require('mongoose');
mongoose.connect(process.env.mongo_url);
const connection=mongoose.connection;
connection.on('connected',()=>{
    console.log('MONGODB Database connected successfully');
})
connection.on('error',()=>{
    console.log('Database connection failed some error occurred');
})
