const router = require("express").Router();

const Office = require("../models/office");

router.get("/offices", (req, res) => {
  Office.find()
    .then(item => res.json(item.map(get => get.serialize())))
    .catch(error => {
      console.log(error);
      res.status(400);
    });
});

router.get("/offices/:id", (req, res) => {
  Office.findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "mother of pearl, something went wrong" });
    });
});

router.post("/offices", (req, res) => {
  const requiredKeys = ["title"];
  for (let i = 0; i < requiredKeys.length; i++) {
    const key = requiredKeys[i];
    if (!key in req.body) {
      const message = `${message} not in body`;
      console.log(message);
      res.status(400);
    }
  }
  Office.create({
    title: req.body.title
  })
    .then(payload => res.status(201).json(payload.serialize()))
    .catch(error => {
      console.log(error);
      res.status(500);
    });
});

router.delete("/offices/:id", (req, res) => {
  Office.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success" });
    })
    .catch(error => {
      res.status(500).json({ message: "error" });
    });
});

router.put("/offices/:id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id must match"
    });
  }
  const updated = {};
  const updateableFields = ["title"];
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
