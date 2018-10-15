const express = require("express");
const bodyParser = require("body-parser");
const { User } = require("../models/users-model");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRY } = require("../config");
const jwtAuth = passport.authenticate("jwt", {
  session: false,
  failureRedirect: "/api/login"
});

console.log("can you hear me USER router!");

const router = express.Router();

const jsonParser = bodyParser.json();

const localAuth = passport.authenticate("local", { session: false });

router.get("/whoami", jwtAuth, (req, res) => {
  return User.findOne({ username: req.user.username })
    .then(doc => {
      res.json(doc.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).end("Something went wrong");
    });
});

router.post("/", jsonParser, (req, res) => {
  const requiredFields = ["username", "password"];
  const missingFields = requiredFields.find(field => !(field in req.body));

  if (missingFields) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing field",
      location: missingFields
    });
  }
  const stringFields = ["username", "password", "firstname", "lastname"];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );
  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Incorrect field type: expected string",
      location: nonStringField
    });
  }
  const explicityTrimmedFields = ["username", "password"];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Cannot start or end with whitespace",
      location: nonTrimmedField
    });
  }
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 5,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      "min" in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      "max" in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );
  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let { username, password, firstName = "", lastName = "" } = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({ username })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: "ValidationError",
          message: "Username is already taken",
          location: "username"
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      console.error(err);

      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }

      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

router.get("/", (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

module.exports = router;
