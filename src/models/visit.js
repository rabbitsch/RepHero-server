const mongoose = require("mongoose");

const schema = mongoose.Schema({
  date: { type: Number },
  office: { type: String },
  goals: { type: String },
  outcome: { type: String },
  nextgoals: { type: String }
});

schema.methods.serialize = function() {
  return {
    id: this._id,
    date: this.date,
    office: this.office,
    goals: this.goals,
    outcome: this.outcome,
    nextgoals: this.nextgoals
  };
};

const Visit = mongoose.model("Visit", schema);

module.exports = Visit;
