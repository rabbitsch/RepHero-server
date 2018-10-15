require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require("./config");

const docPoint = require("./routers/doc-endpoint");
const visitsRouter = require("./routers/visits");
const userRouter = require("./routers/user-router");
const authRouter = require("./routers/auth-router");

const app = express();

//My Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("common"));
app.use(cors());

//My Routers
app.use("/api", visitsRouter);
app.use("/doc", docPoint);
app.use("/api/users", userRouter);
app.use("/api", authRouter);

console.log("can you hear me server");

//CORS Middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  if (req.method === "OPTIONS") {
    return res.send(204);
  }
  next();
});

//Starting my server

var server;

function runServer() {
  const Port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    mongoose.connect(
      DATABASE_URL,
      error => {
        if (error) {
          return reject(error);
        }
        server = app
          .listen(PORT, function() {
            console.log(`${process.env.PORT || 8080} is listening`);
            resolve(server);
          })
          .on("error", function() {
            mongoose.disconnect();
            console.log("we be disconnecting mon");
            reject(error);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("server is closing");
      server.close(err => {
        if (
          error => {
            return reject(error);
          }
        )
          resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => {
    console.error("Unable to start the server.");
    console.error(err);
  });
}

module.exports = { runServer, closeServer, app };
