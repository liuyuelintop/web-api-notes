## Detailed Explanation of the Native JS Code Snippet

```html

<scriptsrc="./assets/run.js"></script>

<script>

// 大文件上传分片

constfileDom = document.querySelector("input");

constCHUNK_SIZE = 5 * 1024 * 1024; // 5 MB

constMAX_WORKER = navigator.hardwareConcurrency || 4;

letfinished = 0;

// const worker = new Worker("./assets/fileworker.js", {

//   type: "module",

// });

fileDom.onchange = asyncfunction (e) {

constfile = e.target.files[0];

constchunklength = Math.ceil(file.size / CHUNK_SIZE);

constcount = Math.ceil(chunklength / MAX_WORKER);

constresult = [];

for (leti = 0; i < MAX_WORKER; i++) {

constworker = newWorker("./assets/fileworker.js", {

type:"module",

      });

conststartIndex = i * count;

letendIndex = startIndex + count;

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

</script>

```

```js

import"./md5.min.js";

console.log("my task is running");

self.onmessage = asyncfunction (e) {

const [file, CHUNK_SIZE, startIndex, endIndex] = e.data;

constresult = [];

for (leti = startIndex; i < endIndex; i++) {

constchunk = awaitgetChunk(file, CHUNK_SIZE, i);

result.push(chunk);

  }

self.postMessage(result);

};


functiongetChunk(file, size, index) {

returnnewPromise((resolve, reject) => {

conststart = index * size;

constend = start + size;

constchunkFile = file.slice(start, end);

constfr = newFileReader();

fr.onload = function (e) {

constarrbuffer = e.target.result;

consthash = SparkMD5.ArrayBuffer.hash(arrbuffer);

resolve({

start,

end,

chunkFile,

index,

hash,

      });

    };

fr.readAsArrayBuffer(chunkFile);

  });

}

```

### Code Implementation Idea

1.**File Selection**

Users select files via `<input type="file" />`.

2.**Chunk Size and Maximum Concurrency**

Set the chunk size to 5MB (`CHUNK_SIZE`) and use `navigator.hardwareConcurrency` to get the system's hardware concurrency, with a default of 4 (`MAX_WORKER`).

3.**File Chunking and Task Distribution**

After selecting the file, calculate the total chunks (`chunklength`) and the number of chunks each Worker needs to process (`count`).

4.**Creating and Assigning Workers**

Create multiple Worker instances, each processing a portion of the chunks.

5.**Worker Processing Logic**

Workers receive the file, chunk size, start, and end indices, read the corresponding chunks, and compute their hash values.

6.**Result Collection and Processing**

The main thread receives the results from Workers, collects all chunk information, and handles subsequent upload tasks once all Workers have completed their tasks.

### Code Highlights

1.**Parallel Processing**

Using Web Workers for parallel processing of file chunks, improving processing speed.

2.**Dynamic Worker Creation**

Dynamically create Workers based on the system's hardware concurrency to optimize performance.

3.**MD5 Hash Calculation**

Calculate the MD5 hash value for each chunk to ensure data integrity.

### Learning Code Design

1.**Step-by-Step Understanding**

Understand the basic principles of file reading and chunking first, then learn how to create and use Web Workers for parallel processing.

2.**Hands-On Practice**

Try to write a simplified version of the code yourself, then gradually add features.

3.**Debugging and Optimization**

Use debugging tools to observe the code execution process, analyze performance bottlenecks, and optimize.

### Disadvantages of Native JS Code for Large File Uploads

1.**Browser Compatibility**

Web Workers and some modern APIs may not be compatible with older browsers.

2.**Network Instability**

If the network is interrupted, chunks need to be re-uploaded, which may increase upload time.

3.**Memory Usage**

Reading multiple chunks simultaneously may use a lot of memory, especially when handling large files.

### Worker API Summary

### Application Scenarios

1.**CPU-Intensive Tasks**

Such as large file processing, image processing, complex calculations, etc.

2.**Long-Running Tasks**

To avoid blocking the main thread and improve user experience.

### Example Code

#### Example 1: Simple Worker

```js
// worker.js

self.onmessage = function (e) {
  constresult = e.data * 2;

  self.postMessage(result);
};

// main.js

constworker = newWorker("worker.js");

worker.postMessage(10);

worker.onmessage = function (e) {
  console.log("Result:", e.data); // Result: 20
};
```

#### Example 2: Processing Large Arrays

```js
// worker.js

self.onmessage = function (e) {
  constdata = e.data;

  constresult = data.map((item) => item * 2);

  self.postMessage(result);
};

// main.js

constworker = newWorker("worker.js");

constlargeArray = newArray(1000000).fill(1);

worker.postMessage(largeArray);

worker.onmessage = function (e) {
  console.log("Processed array:", e.data);
};
```

#### Example 3: File Chunk Processing

```js

// worker.js

self.onmessage = function(e) {

const [file, chunkSize, start, end] = e.data;

constchunks = [];

for (leti = start; i < end; i++) {

constchunk = file.slice(i * chunkSize, (i + 1) * chunkSize);

chunks.push(chunk);

  }

self.postMessage(chunks);

};


// main.js

constfile = ...; // Assume this is a File object from an input element

constchunkSize = 1024 * 1024; // 1 MB

constworker = newWorker('worker.js');

worker.postMessage([file, chunkSize, 0, Math.ceil(file.size / chunkSize)]);

worker.onmessage = function(e) {

console.log('File chunks:', e.data);

};

```
