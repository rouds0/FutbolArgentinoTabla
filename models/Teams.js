var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const team = new Schema({
  tHead: {
    type: Object,
  },
  tBodyEquipos: {
    type: Object,
  },
  tBodyPuntos: {
    type: Object,
  },
  tBodyImg: {
    type: Object,
  },
  
},{
  versionKey: false,
  timestamps: true,
});
team.set("toJSON", {
  transform:(doc, ret) =>{
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }

})
const Team = mongoose.model("Team", team);

module.exports = Team;
