const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/postlike09")
.then(()=>console.log("db is badhiya"))
.catch((error)=>console.log(error));