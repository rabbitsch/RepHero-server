require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
mongoose.Promise = global.Promise

const {DATABASE_URL,PORT} = require('./config');

const routerPoint = require('./routers/router-endpoints');
const docPoint = require('./routers/doc-endpoint');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(morgan('common'));


app.use('/api',routerPoint);
app.use('/doc',docPoint);

console.log('can you hear me server')

//Starting my server

var server;

function runServer(){
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
      console.log('server is closing')
      server.close(err =>{
        if(error =>{
          return reject(error);
        })
        resolve();
      })
    })
  })

}


if (require.main === module) {
  runServer(DATABASE_URL)
    .catch(err => {
      console.error('Unable to start the server.')
      console.error(err)
    })
};


module.exports = {runServer,closeServer,app};
