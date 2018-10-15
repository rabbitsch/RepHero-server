const router = require("express").Router();

const Visit = require("../models/visit");

//Get endpoint
router.get("/visits", (req, res) => {
  Visit.find()
    .then(item => res.json(item.map(get => get.serialize())))
    .catch(error => {
      console.log(error);
      res.status(400);
    });
});

//Post endpoint
router.post("/visits", (req, res) => {
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

//Delete endpoint
router.delete("/visits/:id", (req, res) => {
  Visit.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went wrong" });
    });
});

//Put endpoint
router.put("/visits/:id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id must match"
    });
  }
  const updated = {};
  const updateableFields = ["date", "office", "goals", "outcome", "nextgoals"];
  updatedableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  Visit.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: "something went wrong" }));
});

module.exports = router;
