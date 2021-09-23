var Canvas = require("canvas");
const {createCanvas} = require("canvas");
const tmPose = require('@teachablemachine/pose');
global.fetch = require("node-fetch");
const express = require("express");
const app = express();
app.use(express.json({ limit : "50mb" }));


const URL = "https://teachablemachine.withgoogle.com/models/ZXEZyolyru/";
let model, new_canvas, context;

async function init(){
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmPose.load(modelURL, metadataURL);
  new_canvas = new createCanvas(530 , 338);
  context = new_canvas.getContext('2d');

}

async function predict(img_base64){
  const buffer = Buffer.from(img_base64, "base64");
  const img = await Canvas.loadImage(buffer);
  context.drawImage(img, 0, 0);

  const { pose, posenetOutput } = await model.estimatePose(new_canvas, false);
  const prediction = await model.predictTopK(posenetOutput, 3);
  return new Promise(resolve => {
    setTimeout(() => resolve(prediction));
  });
}

app.post("/pose_detection", (req, res) => {
  predict(req.body.img_base64).then(result => res.send(result));
});

app.listen(3333, () => {
  init();
  console.log("Listening on port 3333...");
  console.log("")
});
