const team=require('./models/Teams');
var express = require("express");
require("dotenv");
var app = express();
var mongoose = require("mongoose");
const datos=require("./controller/index")
const path = require('path')
const Handlebars = require('handlebars')
const hbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

mongoose.connect(process.env.MONGO, {enableUtf8Validation: true}, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
}).then(()=>{
  console.log("DB is connected");})
  .catch(err=>{
    console.error(err);});


app.use(express.static(process.cwd() + "/views"));

app.use(express.static('public'));
app.use(express.json());
app.engine('hbs', 
hbs.engine({ extname: 'hbs', 
      defaultLayout: 'index', 
      layoutsDir: __dirname + '/views', 
      handlebars: allowInsecurePrototypeAccess(Handlebars),
      helpers: {
         colorFondo: ((obj, num) => {
          if(obj.POSICION <= 4)
          {
            return "colorVerde"
          }
          
          else if(obj.POSICION > num-4)
          {
            
            return "colorRojo"
          }
          return "none";
      })
      
      }
}));


app.set('view engine', 'hbs')
app.use(express.static("public/images"));

app.get("/",  async(req, res) =>{
  try {
    let teams = await team.find().exec();
    let equipos=[]
    let mayorNumero
    teams.map(elem => {
    equipos.push(elem)
      
      }
    )
    const resultadosOrdenados = equipos.sort((a,b) =>{
      return Number.parseInt(b.POSICION) - Number.parseInt(a.POSICION)
    }) 
    mayorNumero=resultadosOrdenados[0].POSICION
    
    equipos.sort((p1,p2)=>{
      if(p1.POSICION<p2.POSICION)
      {
        return -1
      }
      else if(p1.POSICION>p2.POSICION)
      {
        return 1
      }
      else{
        return 0
      }
    })
      res.render('index',{
        equipos:equipos,
        mayorNumero:equipos.length
      });
   
  }

catch(e) {
    console.error(e);
    let message = 'Error en la consulta';
    return res.status(500).json({
        message
    });
}});

app.listen(process.env.PORT,function() {
  console.log("Listening on PORT " + process.env.PORT || 3000);
});
