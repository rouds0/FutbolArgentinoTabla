const team=require('./models/Teams');
var express = require("express");
var app = express();
var mongoose = require("mongoose");
const PORT =process.env.PORT;
const datos=require("./controller/index")
require('./config/mongo');
const path = require('path')
const Handlebars = require('handlebars')
const hbs = require('express-handlebars');
const hbs2 = require('hbs');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var helpers = require('handlebars-helpers')(); 
app.use(express.static(process.cwd() + "/views"));
var tabla=""

var contadorPosiciones=0
var contadorImagenes=0
var contadorPuntos=0
var contadorEquipos=0
app.use(express.static('public'));
app.use(express.json());
app.engine('hbs', 
hbs.engine({ extname: 'hbs', 
      defaultLayout: 'index', 
      layoutsDir: __dirname + '/views', 
      handlebars: allowInsecurePrototypeAccess(Handlebars),

      helpers:
      {
          tabla: function(posicionesBD,equipos,imagen) {
            if(contadorEquipos!==1)
            {
              contadorEquipos++
            let imagenes=Object.keys(imagen)
            let equiposBD=Object.keys(equipos)
            let posiciones=Object.keys(posicionesBD)
            let contadorEquipo=0
            let contadorImagen=0
            let claveImagen=0
            let claveEquipos=0
            let clavePuntos=0
            let contadorPuntosMovil=0
            for(let i=0;i<=posiciones.length;i++){
              if(i%9===0)
              {
               tabla+="<tr>"

              }
              clavePuntos = posiciones[i];
              if(contadorPuntosMovil===9)
              {
                contadorPuntosMovil=0;
              }
              if(clavePuntos!=undefined)
              {
                  if(i!==0)
                  {
                    if(contadorPuntosMovil==4||contadorPuntosMovil==5||contadorPuntosMovil==6)
                    {
                      tabla+=`<td class="movil">${posicionesBD[clavePuntos]}</td>`
                      contadorPuntosMovil++
                    }
                    
                    else
                    {
                      tabla+=`<td>${posicionesBD[clavePuntos]}</td>`
                      contadorPuntosMovil++
                    }
                  }
                  else
                  {
                    tabla+=`<td>${posicionesBD[clavePuntos]}</td>`
                  }
                 
              }
              
                if(i%9===0)
                {
                  claveImagen = imagenes[contadorImagen];
                  claveEquipos = equiposBD[contadorEquipo];
                  claveEquiposSpan = equiposBD[contadorEquipo+1]
                  
                  if(claveEquipos!==undefined)
                  {
                    if(contadorImagen<4)
                    {
                      tabla+=`<td class="pasanALibertadores">
                      <img src="${imagen[claveImagen]}" alt="${equipos[claveEquipos]}">
                      <span class="textoNoMovil">${equipos[claveEquipos]}</span>
                      <span class="textoMovil">${equipos[claveEquiposSpan]}</span>
                      </td>`
                      contadorEquipo=contadorEquipo+2
                      contadorImagen++
                     
                    }else if(contadorImagen>=imagenes.length-4){

                      tabla+=`<td class="descienden">
                      <img src="${imagen[claveImagen]}" alt="${equipos[claveEquipos]}">
                      <span class="textoNoMovil">${equipos[claveEquipos]}</span>
                      <span class="textoMovil">${equipos[claveEquiposSpan]}</span>
                      </td>`
                      contadorEquipo=contadorEquipo+2
                      contadorImagen++

                    }else{
                      tabla+=`<td>
                      <img src="${imagen[claveImagen]}" alt="${equipos[claveEquipos]}">
                      <span class="textoNoMovil">${equipos[claveEquipos]}</span>
                      <span class="textoMovil">${equipos[claveEquiposSpan]}</span>
                      </td>`
                      contadorEquipo=contadorEquipo+2
                      contadorImagen++
                    }
                  
                  }
                  
                  
                }
              
               
            }
          }
          else{
            return tabla
           }
        }
    }
      
}))

hbs2.registerPartials(__dirname + '/views/partials',function(err){});

app.set('view engine', 'hbs')


app.get("/",  async(req, res) =>{
  try {
    let teams = await team.find().exec();
    let equipos=[]
    teams.map(elem => {
    equipos.push(elem)

      res.render('index',{
        thead:equipos,
        tbody:elem.tBodyEquipos,
        tbodyPuntos:elem.tBodyPuntos,
        tbodyImg:elem.tBodyImg
       
      }) ;
     
      }
      )
    
   
  }

catch(e) {
    console.error(e);
    let message = 'Error en la consulta';
    return res.status(500).json({
        message
    });
}});


    
app.listen(PORT, function() {
  console.log("Listening on PORT " + PORT);
});
