var Canvas = require("canvas");
const {createCanvas} = require("canvas");
const tmPose = require('@teachablemachine/pose');
global.fetch = require("node-fetch");
const express = require("express");
const app = express();
app.use(express.json({ limit : "50mb" }));


const URL = "https://teachablemachine.withgoogle.com/models/ZXEZyolyru/";
let model, maxPredictions;