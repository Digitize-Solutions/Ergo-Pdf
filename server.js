import generatePdf from './pdf-generator/index.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import postmark from 'postmark';
import morgan from 'morgan';
import dotenv from "dotenv";

//const express = require("express");
//const cors = require("cors");
//const morgan = require("morgan");
//const axios = require("axios").default;
//const bodyParser=require("body-parser");
//const postmark =require("postmark");
//require("dotenv").config();
//const generatePdf=require(// from './pdf-generator/index.js';
dotenv.config();
const app = express();

// const PORT = process.env.PORT || 80;
const PORT = process.env.PORT || 3001;
const SENDER_EMAIL = 'emuca@emuca.com';
const client = new postmark.ServerClient(process.env.SERVER_TOKEN);
//digitize Code
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});



app.use(morgan("dev"));
// app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));
var jsonParser = bodyParser.json({ limit: "50mb" });
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.options('*', cors());
// app.use(express.json());   

app.get("/api/health", (req, res) => {
  res.status(200).send({ message: "server healthy!" });
});

app.get('/', (req, res) => {

    
  res.send('Welcome to Make REST API Calls In updated Express!')

})



//function to get PDF
app.post('/api/pdf/:template',jsonParser, async (req, res) => {
  if (!req.body) return res.status(422).send();
  if (!req.params.template)
    return res.status(422).send({ message: 'missing PDF template' });

  const template = req.params.template;
  if (!(template === 'ergo') )
    return res.status(422).send({ message: 'Template not found', status: false });

  try {
    const pdf = await generatePdf(req.params.template, req.body);
    res.set(
      Object.assign(
        { 'Content-type': 'application/pdf' },
        req.query.download === 'true'
          ? {
              'Content-Disposition': `attachment;filename=${
                req.query.filename || 'threekit-configuration.pdf'
              }`,
            }
          : {}
      )
    );
    res.end(pdf);
  } catch (e) {
    console.log(e);
    res.status(422).send(e);
  }
});

//function to get PDF
app.get('/api/pdf/:template',jsonParser, async (req, res) => {
  // if (!req.body) return res.status(422).send();
  if (!req.params.template)
    return res.status(422).send({ message: 'missing PDF template' });

  const template = req.params.template;
  if (!(template === 'ergo') )
    return res.status(422).send({ message: 'Template not found', status: false });
  try {
    const pdf = await generatePdf(req.params.template);
    res.set(
      Object.assign(
        { 'Content-type': 'application/pdf' },
        req.query.download === 'true'
          ? {
              'Content-Disposition': `attachment;filename=${
                req.query.filename || 'threekit-configuration.pdf'
              }`,
            }
          : {}
      )
    );
    res.end(pdf);
  } catch (e) {
    console.log(e);
    res.status(422).send(e);
  }
});


app.listen(PORT, () => console.log("listening on port: ", PORT));