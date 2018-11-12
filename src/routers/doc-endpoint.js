const axios = require("axios");
const express = require("express");
const router = express.Router();

const DOC_BASE_URL = "https://api.betterdoctor.com/2016-03-01/practices";
const DOC_KEY_ID = process.env.DOC_KEY;

console.log(DOC_KEY_ID, "this is the doc key id!!");
router.get("/", (req, res) => {
  console.log(req.query.name, "hello this is my doc end point talking!!!");

  const params = {
    user_key: DOC_KEY_ID,
    skip: 0,
    limit: 10,
    location: "37.773,-122.413,100",
    user_location: "37.773,-122.413",
    name: req.query.name
  };

  if (req.query.location) {
    params.location = req.query.location;
  }

  axios
    .get(`${DOC_BASE_URL}`, { params })
    .then(payload => {
      console.log(payload);
      res.json(payload.data).end();
    })
    .catch(error => {
      console.log(error);
      res.status(500);
    });
});

module.exports = router;
