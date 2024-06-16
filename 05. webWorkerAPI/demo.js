// 大文件上传分片
const fileDom = document.querySelector("input");
const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_WORKER = navigator.hardwareConcurrency || 4;
let finished = 0;
// const worker = new Worker("./assets/fileworker.js", {
//   type: "module",
// });
fileDom.onchange = async function (e) {
  const file = e.target.files[0];
  const chunklength = Math.ceil(file.size / CHUNK_SIZE);
  const count = Math.ceil(chunklength / MAX_WORKER);
  const result = [];
  for (let i = 0; i < MAX_WORKER; i++) {
    const worker = new Worker("./assets/fileworker.js", {
      type: "module",
    });
    const startIndex = i * count;
    let endIndex = startIndex + count;
    if (endIndex > chunklength) {
      endIndex = chunklength;
    }
    worker.postMessage([file, CHUNK_SIZE, startIndex, endIndex]);
    worker.onmessage = function (e) {
      finished++;
      worker.terminate();
      e.data.forEach((item) => {
        result[item.index] = item;
      });
      if (finished === MAX_WORKER) {
        // 处理后续上传的任务
        console.log(result);
      }
    };
  }
};
