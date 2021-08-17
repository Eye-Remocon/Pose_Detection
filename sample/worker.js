const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const tmPose = require('@teachablemachine/pose');
const { get, getSync } = require('@andreekeberg/imagedata')
global.fetch = require("node-fetch");

const URL = "https://teachablemachine.withgoogle.com/models/ZXEZyolyru/";
let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmPose.load(modelURL, metadataURL);

    tmPose.load(modelURL, metadataURL).then(mod => {
        model = mod;
        maxPredictions = model.getTotalClasses();

    }).catch(err => console.log(err));
}

async function predict() {
    await init();
    let img = getSync('clap.jpg')
    console.log(img)

    const { pose, posenetOutput } = model.estimatePose(img);
    console.log("posenet output: " + posenetOutput)
    const prediction = model.predict(posenetOutput);


    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className;
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
    console.log(classPrediction);
    parentPort.postMessage(classPrediction);
    return classPrediction;
}

const {
    Worker,
    isMainThread,
    parentPort
} = require('worker_threads');

console.log('isMainThread:', isMainThread); // false

parentPort.on('message', (msg) => {
    console.log(msg);
    predict();
});
