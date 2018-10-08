const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise

const {DATABASE_URL} = require('./config');

const routerPoint = require('./routers/router-endpoints');

const app = express();

app.use(express.static('public'));
app.use(express.json());


app.use(routerPoint);


//Starting my server

var server;

function startServer(){
  const Port = process.env.PORT || 8080;
  return new Promise((resolve,reject)=>{
    mongoose.connect(DATABASE_URL,error =>{
      if(error){
        return reject(error)
      }
      server = app.listen(PORT, function(){
        console.log(`${process.env.PORT || 8080} is listening`)
        resolve(server)
      })
      .on('error', function(){
        mongoose.disconnect();
        console.log('we be disconnecting mon');
        reject(error);
      })

    })
  })
}


function closeServer(){
  return mongoose.disconnect().then(()=>{
    return new Promise((resolve,reject)=>{
      
    })
  })

}
