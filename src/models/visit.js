const mongoose = require("mongoose");

const schema = mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  },
  date: { type: String },
  office: { type: mongoose.SchemaTypes.ObjectId, ref: "Office" },
  goals: { type: [String] },
  outcome: { type: [String] },
  nextgoals: { type: [String] }
});

schema.methods.serialize = function() {
  console.log({ o: this.office });
  return {
    id: this._id,
    date: this.date,
    office: this.office ? this.office.serialize() : null,
    goals: this.goals,
    outcome: this.outcome,
    nextgoals: this.nextgoals
  };
};

const Visit = mongoose.model("Visit", schema);

module.exports = Visit;
