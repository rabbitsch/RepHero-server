const mongoose = require("mongoose");

const schema = mongoose.Schema({
  // user: {
  //   type: mongoose.SchemaTypes.ObjectId,
  //   ref: "User"
  // },
  title: String
});

schema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title
  };
};

const Office = mongoose.model("Office", schema);

module.exports = Office;
