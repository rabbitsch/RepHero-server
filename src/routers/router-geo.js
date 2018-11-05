const axios = require("axios");
const express = require("express");
const qs = require("querystring");

const router = express.Router();

const GEO_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const GEOCODE_ID = process.env.GEOCODE_ID;

router.get("/", (req, res) => {
  axios
    .get(`${GEO_BASE_URL}?address=${req.query.address}`, {
      params: {
        key: GEOCODE_ID
      }
    })
    .then(payload => {
      res.json(payload.data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        message: "Something went wrong while querying Geo code"
      });
    });
});

module.exports = router;
