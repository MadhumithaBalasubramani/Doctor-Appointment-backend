const express=require('express');
const cors = require('cors');
const router = require("../serverBackend/Routes/userRoutes")
const routersAdmin=require('../serverBackend/Routes/adminRoutes')
const routedoc=require('../serverBackend/Routes/doctorRoutes')
// const routerDoc =require('../serverBackend/Routes/doctorRoutes')
const connect=require('./Common/connection');
const app=express();
require('dotenv').config();
app.use(express.json());
app.use(cors());
app.use(router);
app.use(routersAdmin);
app.use(routedoc)
connect();
const port=process.env.PORT||8000;  
app.listen(port,() => console.log("server running on ", port))
