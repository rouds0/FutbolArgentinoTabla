var express = require("express");
var router = express.Router();
var path = require("path");
var cheerio = require("cheerio");
var request = require("request");
require("../config/mongo");
const team = require("../models/Teams");
const mongoose = require("mongoose");


    request({uri:'https://www.futbolargentino.com/primera-division/tabla-de-posiciones', method:'GET', encoding:'binary'}, function(error, response, html) {
      
    if(!error  && response.statusCode==200) {
      const $=cheerio.load(html,{ decodeEntities: false });
      let tHead={}
      let tBodyEquipos={}
      let tBodyPuntos={}
      let tBodyImg={}
        $('.thead-light tr > th ').each(function(i, elemThead) {
          let textoThead= $(elemThead).text()
          tHead[textoThead]=textoThead
         
         
      });
        $('.table > tbody > tr > td > a > span ').each(function(i, elemTbody) {
          let id="id"+i
          let textoTbody = $(elemTbody).text()
          tBodyEquipos[id]=textoTbody
         
          
      })
        $('.table > tbody > tr > td > a > img ').each(function(i, elemTbodyImg) {
          let id="id"+i
          let imageTBody = $(elemTbodyImg).attr('data-src')
          tBodyImg[id]=imageTBody
       
      })
      $('.table > tbody > tr > td  ').each(function(i, elemTbody) {
        let id="id"+i
        let textTBodyPuntos = $(elemTbody).text().trim()
        if(textTBodyPuntos.length<=3){
          tBodyPuntos[id]=textTBodyPuntos
        }
        
        
    })

       let obj={
        tHead:tHead,
        tBodyEquipos:tBodyEquipos,
        tBodyPuntos:tBodyPuntos,
        tBodyImg:tBodyImg
      }
      
      team.find({},(err,data)=>{
        if(err){
          console.log(err)
        }else{
          if(data.length==0){
            team.create(obj,(err,data)=>{
              if(err){
                console.log(err)
              }else{
                
              }
            })
          }else{
            team.findOneAndUpdate({},obj,(err,data)=>{
              if(err){
                console.log(err)
              }else{
                
              }
            })
          }
        }
      }
      )
      
  }
  
})

