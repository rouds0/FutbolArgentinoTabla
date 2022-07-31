const mongoose = require('mongoose');
const connection=process.env.MONGO;

mongoose.connect(connection, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
}).then(()=>{
  console.log("DB is connected");})
  .catch(err=>{
    console.error(err);});

