const axios = require('axios');
const express = require('express');
const router = express.Router();


const DOC_BASE_URL = 'https://api.betterdoctor.com/2016-03-01/practices'
const DOC_KEY_ID = process.env.DOC_KEY

const DOC_END_URL = '&location=37.773%2C-122.413%2C100&user_location=37.773%2C-122.413&skip=0&limit=10'

console.log(DOC_KEY_ID, 'this is the doc key id!!')
router.get('/',(req,res)=>{
  axios.get(`${DOC_BASE_URL}?name=${req.query.name}${DOC_END_URL}&user_key=${DOC_KEY_ID}`,{
    params:{name:req.query.name}
  }).then(payload => {
    res.json(payload)
  }).catch(error =>{
    console.log(error);
    res.status(500);
  })
})


module.exports = router;
