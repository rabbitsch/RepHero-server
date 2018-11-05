require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
mongoose.Promise = global.Promise;

// imports the Office model, executes its code but dots not store any ref
require("./models/office");

const { DATABASE_URL, PORT } = require("./config");

const officesRouter = require("./routers/office");
const docPoint = require("./routers/doc-endpoint");
const visitsRouter = require("./routers/visits");
const userRouter = require("./routers/user-router");
const authRouter = require("./routers/auth-router");
const geoRouter = require("./routers/router-geo");
const { localStrategy, jwtStrategy } = require("./auth/auth-strat");

const app = express();

//My Middleware

app.use(express.static("public"));
app.use(express.json());
app.use(morgan("common"));
app.use(cors());
passport.use(localStrategy);
passport.use(jwtStrategy);

//My Routers
app.use("/api", officesRouter);
app.use("/api", visitsRouter);
app.use("/doc", docPoint);
app.use("/api/users", userRouter);
app.use("/api", authRouter);
app.use("/geo", geoRouter);

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

const jwtAuth = passport.authenticate("jwt", { session: false });

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
