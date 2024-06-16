const scanFile = document.querySelector(".scan-file");
const scanDir = document.querySelector(".scan-dir");
const upload = document.querySelector(".upload");
const dropContent = document.querySelector(".drop-content");
const list = document.querySelector("tbody");
const fileInput = document.querySelector("input.file");
const fileInputDir = document.querySelector("input.dir");

const tempFileList = [];

// 01. 单、多文件上传
scanFile.addEventListener("click", function () {
  fileInput.click(); // 模拟点击文件输入框，打开文件选择对话框
});

fileInput.addEventListener("change", function (e) {
  // 将选中的文件添加到临时文件列表
  tempFileList.push(...e.target.files);
  renderFilelist(); // 更新文件列表显示
});

// 02. 文件夹上传
scanDir.addEventListener("click", function () {
  fileInputDir.click(); // 模拟点击文件夹输入框，打开文件夹选择对话框
});

fileInputDir.addEventListener("change", function (e) {
  // 将选中的文件夹中的文件添加到临时文件列表
  tempFileList.push(...e.target.files);
  renderFilelist(); // 更新文件列表显示
});

// 03. 拖拽上传
dropContent.addEventListener("dragover", (e) => e.preventDefault()); // 阻止默认的拖拽行为
dropContent.addEventListener("drop", (e) => {
  e.preventDefault(); // 阻止默认的放置行为
  for (const item of e.dataTransfer.items) {
    // 处理拖入的每一个项目
    getFileByEntry(item.webkitGetAsEntry());
  }
});

/**
 * 根据文件或文件夹的 entry 读取文件
 * @param {FileSystemEntry} entry - 文件系统条目
 * @param {string} path - 当前路径，用于处理文件夹中的文件路径
 */
function getFileByEntry(entry, path = "") {
  if (entry.isFile) {
    // 如果是文件
    entry.file((file) => {
      file.path = `${path}${file.name}`; // 设置文件的路径
      tempFileList.push(file); // 将文件添加到临时文件列表
      renderFilelist(); // 更新文件列表显示
    });
  } else {
    // 如果是文件夹
    const reader = entry.createReader();
    reader.readEntries((entries) => {
      for (const item of entries) {
        // 递归处理文件夹中的每一个条目
        getFileByEntry(item, `${path}${entry.name}/`);
      }
    });
  }
}

/**
 * 渲染文件列表
 */
function renderFilelist() {
  list.innerHTML = ""; // 清空当前列表
  tempFileList.forEach((file, index) => {
    const tr = document.createElement("tr"); // 创建表格行
    list.appendChild(tr); // 添加行到表格
    tr.innerHTML = `
      <td>${file.name}</td>
      <td>${file.webkitRelativePath || file.path}</td>
      <td>${file.type}</td>
      <td>${transformByte(file.size)}</td>
      <td onclick=delFile(${index})>删除</td>
    `; // 填充行内容
  });
}

/**
 * 将文件大小转换为合适的单位显示
 * @param {number} size - 文件大小，单位为字节
 * @returns {string} - 转换后的文件大小字符串
 */
function transformByte(size) {
  if (size < 1024 ** 2) {
    return (size / 1024).toFixed(1) + "KB";
  } else if (size < 1024 ** 3) {
    return (size / 1024 ** 2).toFixed(1) + "MB";
  } else {
    return (size / 1024 ** 3).toFixed(1) + "GB";
  }
}

/**
 * 删除文件
 * @param {number} index - 要删除的文件在列表中的索引
 */
function delFile(index) {
  tempFileList.splice(index, 1); // 从临时文件列表中移除文件
  renderFilelist(); // 更新文件列表显示
}
