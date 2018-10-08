const express = require('express');
const router = express.Router();

const crm = require('../models/crm-model');



router.get('/crm', (req,res) =>{
  crm.find()
  .then(item => res.json(item.map(get => get.serialize())))
  .catch(error =>{
    console.log(error)
    res.status(400);
  })

})


router.post('/crm', (req,res)=>{
  const keys = ['date','office', 'goals','outcome','nextgoals'];
  for(let i = 0; i<keys.length; i++){
    const field = keys[i];
    if(!field in req.body){
      const message = `${field} not in body`;
      console.log(message);
      res.status(400)
    }
  }crm.create({
    date:req.body,
    office:req.body,
    goals:req.body,
    outcome:req.body,
    nextgoals:req.body
  }).then(payload => {
    res.status(200)
    payload.serialize()
  }).catch(error =>{
    console.log(error)
    res.status(500);
  })
})

module.exports = router;
