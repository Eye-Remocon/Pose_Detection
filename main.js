var Canvas = require("canvas");
const {createCanvas} = require("canvas");
const tmPose = require('@teachablemachine/pose');
global.fetch = require("node-fetch");
const express = require("express");
const app = express();
app.use(express.json({ limit : "50mb" }));


const URL = "https://teachablemachine.withgoogle.com/models/ZXEZyolyru/";
let model, maxPredictions;

async function predict(img_base64){
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmPose.load(modelURL, metadataURL);

    tmPose.load(modelURL, metadataURL).then(mod => {
        model = mod;
        maxPredictions = model.getTotalClasses();

    }).catch(err => console.log(err));

    const buffer = Buffer.from(img_base64, "base64");
    const img = await Canvas.loadImage(buffer);
    var new_canvas = new createCanvas(img.width, img.height);
    var context = new_canvas.getContext('2d');
    img.onload = function (){
        context.drawImage(img, 0, 0, img.width, img.height);
    }

    const { pose, posenetOutput } = await model.estimatePose(new_canvas, false);
    const prediction = await model.predict(posenetOutput);
    return new Promise(resolve => {
        setTimeout(() => resolve(prediction));
    });
}

app.post("/pose_detection", (req, res) => {
    predict(req.body.img_base64).then(result => res.send(result));
});

app.listen(3000, () => {
    console.log("Listening on port 3000...");
    console.log("")
});