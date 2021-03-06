const router = require("express").Router();

// const Office = require("../models/office");

const Visit = require("../models/visit");
const jwtAuth = require("passport").authenticate("jwt", {
  session: false,
  failureRedirect: "/api/login"
});

//Get endpoint
router.get("/visits", (req, res) => {
  //console.log(req, "this is my req in get visit >>>>>>");
  //{office:req.params.officeid}

  const filters = {};

  if (req.query.office) {
    filters.office = req.query.office;
  }

  if (req.query.user) {
    filters.user = req.query.user;
  }

  Visit.find(filters)
    .populate("office")
    .populate("user")
    .then(item => res.json(item.map(get => get.serialize())))
    .catch(error => {
      console.log(error);
      res.status(400);
    });
});

// Get Id endpoint
router.get("/visits/:id", (req, res) => {
  Visit.findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "mother of pearl, something went wrong" });
    });
});

//Post endpoint
router.post("/visits", (req, res) => {
  console.log(req.body, "this is my post endpoint");
  const keys = ["date", "office", "goals", "outcome"];
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
    outcome: req.body.outcome
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
  const updateableFields = ["date", "office", "goals", "outcome"];
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
