const mongoose = require("mongoose");

const schema = mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  },
  date: { type: String },
  office: { type: mongoose.SchemaTypes.ObjectId, ref: "Office" },
  goals: { type: [String] },
  outcome: { type: [String] }
});

schema.methods.serialize = function() {
  console.log({ Date: this.date });
  console.log({ office: this.office });
  return {
    id: this._id,
    date: this.date,
    office: this.office,
    goals: this.goals,
    outcome: this.outcome
  };
};

const Visit = mongoose.model("Visit", schema);

module.exports = Visit;

//? this.office.serialize() : null,
