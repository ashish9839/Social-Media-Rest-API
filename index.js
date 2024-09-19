const express=require('express');
const app=express();

const mongoose=require('mongoose');
const helmet=require('helmet');
const morgan=require('morgan');
const dotenv=require('dotenv');

const userRoute=require('./routes/users');
const authRoute=require('./routes/auth');
const postRoute=require('./routes/posts');

dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    {useNewUrlParser:true,useUnifiedTopology: true}
);

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);

app.listen(7000,()=>{
     console.log("backend server is ready and running")
})