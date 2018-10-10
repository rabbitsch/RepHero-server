const router = require("express").Router();

const Visit = require("../models/visit");

router.get("/", (req, res) => {
  Visit.find()
    .then(item => res.json(item.map(get => get.serialize())))
    .catch(error => {
      console.log(error);
      res.status(400);
    });
});

router.post("/", (req, res) => {
  const keys = ["date", "office", "goals", "outcome", "nextgoals"];
  for (let i = 0; i < keys.length; i++) {
    const field = keys[i];
    if (!field in req.body) {
      const message = `${field} not in body`;
      console.log(message);
      res.status(400);
    }
  }

  Visit.create({
    date: req.body.date,
    office: req.body.office,
    goals: req.body.goals,
    outcome: req.body.outcome,
    nextgoals: req.body.nextgoals
  })
    .then(payload => res.status(201).json(payload.serialize()))
    .catch(error => {
      console.log(error);
      res.status(500);
    });
});

module.exports = router;
