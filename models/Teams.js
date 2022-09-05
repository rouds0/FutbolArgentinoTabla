var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const team = new Schema({
  POSICION:  Number,
  IMG: String,
  NOMBRE: String,
  NOMBREMOVIL: String,
  PJ: Number,
  PG: Number,
  PE: Number,
  PP: Number,
  GF: Number,
  GC: Number,
  DG: Number,
  PTS: Number
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
