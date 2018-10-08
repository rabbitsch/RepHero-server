const mongoose = require('mongoose');


const crmSchema = mongoose.Schema({
  date:{type:Date},
  office:{type:String},
  goals:{type:String},
  outcome:{type:String},
  nextgoals:{type:String}

});

crmSchema.methods.serialize = function(){
  return {
    id: this._id,
    date: this.date,
    office:this.office,
    goals: this.goals,
    outcome:this.outcome,
    nextgoals: this.nextgoals
  }

};

const crm = mongoose.model('crm', crmSchema);

module.exports = crm;
