var express = require("express");
var router = express.Router();
var path = require("path");
var cheerio = require("cheerio");
var request = require("request");
const team = require("../models/Teams");
const mongoose = require("mongoose");
const utf8_encode=require("utf8")
let equipos
request({uri:'https://www.futbolargentino.com/primera-division/tabla-de-posiciones', method:'GET', encoding:'binary'}, function(error, response, html) {
      
  if(!error  && response.statusCode==200) {
     const $=cheerio.load(html,{ decodeEntities: false });
        $('.table >  tbody ').find("tr").each(async function(i, elem) {
          
          let posicion = parseInt($(elem).find("td:nth-child(1)").text())
          let nombreEquipo = utf8_encode.decode($(elem).find("a > span.d-none.d-md-inline").text().trim())
          let nombreEquipoMovil = utf8_encode.decode($(elem).find("a > span.d-md-none").text().trim())
          let imagen=$(elem).find('a > img').attr('data-src')
          let partidoJugados=parseInt($(elem).find('td:nth-child(3)').text())
          let partidoGanados=parseInt($(elem).find('td:nth-child(4)').text())
          let partidoEmpatados=parseInt($(elem).find('td:nth-child(5)').text())
          let partidoPerdidos=parseInt($(elem).find('td:nth-child(6)').text())
          let golesAFavor=parseInt($(elem).find('td:nth-child(7)').text())
          let golesEnContra=parseInt($(elem).find('td:nth-child(8)').text())
          let diferenciaDeGoles=parseInt($(elem).find('td:nth-child(9)').text())
          let puntos=parseInt($(elem).find('td:nth-child(10)').text())
          equipos={
            POSICION:posicion,
            IMG:imagen,
            NOMBRE:nombreEquipo,
            NOMBREMOVIL:nombreEquipoMovil,
            PJ: partidoJugados,
            PG: partidoGanados,
            PE: partidoEmpatados,
            PP: partidoPerdidos,
            GF: golesAFavor,
            GC: golesEnContra,
            DG: diferenciaDeGoles,
            PTS: puntos
          }
          
          await team.findOneAndUpdate(equipos, { status: request.status }, { upsert: true });

      })
  }
 
})

