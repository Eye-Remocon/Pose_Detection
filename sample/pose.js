const { Worker, isMainThread } = require('worker_threads');

const worker = new Worker('./worker.js');
console.log('isMainThread:', isMainThread); // true

setTimeout(() => {
    worker.postMessage('message from mainThread');
}, 2000);

worker.on('message', (msg) => {
    console.log(msg);
});
