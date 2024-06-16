## Drag and Drop API 学习笔记

### 概述

Drag and Drop API 提供了一种在 Web 页面上实现拖放功能的方式。这些 API 允许用户通过拖动操作来改变元素的位置，或将数据从一个位置拖放到另一个位置。

### 应用场景

- 文件上传：用户可以将文件从桌面拖放到浏览器中进行上传。
- 拖拽排序：用户可以通过拖动来改变列表元素的顺序。
- 拖放区域：用户可以将元素拖放到特定区域中进行处理。

### 基本概念和事件

- `draggable` 属性：指定元素是否可拖动。
- `dragstart` 事件：在拖动操作开始时触发。
- `drag` 事件：在拖动过程中持续触发。
- `dragend` 事件：在拖动操作结束时触发。
- `dragenter` 事件：当拖动的元素进入目标区域时触发。
- `dragover` 事件：当拖动的元素在目标区域内移动时持续触发。
  - `e.preventDefault();` 这行代码是阻止浏览器默认处理 `dragover` 事件。默认情况下，浏览器不会允许在目标上放置元素。调用 `preventDefault` 可以让我们自己定义放置行为。
- `dragleave` 事件：当拖动的元素离开目标区域时触发。
- `drop` 事件：当拖动的元素在目标区域内释放时触发。
  - `e.preventDefault();` 这行代码是阻止浏览器默认处理 `drop` 事件。默认情况下，浏览器会出入文本或者打开拖入的文件

### 拖拽排序详细注释

1. **获取要进行排序的列表元素**

   ```javascript
   const sortableList = document.getElementById("sortableList");
   let draggingElement = null; // 用于存储当前被拖动的元素
   ```

   这两行代码用于获取将要进行排序的列表，并初始化一个变量用于存储正在被拖动的元素。

2. **当拖动开始时触发事件**

   ```javascript
   sortableList.addEventListener("dragstart", function (e) {
     e.target.classList.add("dragging"); // 添加一个类以表示正在拖动
     draggingElement = e.target; // 将拖动的元素存储起来
   });
   ```

   这段代码为 `sortableList` 添加了一个 `dragstart` 事件监听器。当拖动开始时，给被拖动的元素添加一个 `dragging` 类，并将其存储在 `draggingElement` 变量中。

3. **当拖动元素在目标元素上方时触发事件**

   ```javascript
   sortableList.addEventListener("dragover", function (e) {
     e.preventDefault(); // 阻止默认行为，允许我们自定义放置行为
     e.dataTransfer.dropEffect = "move"; // 设置拖放操作的效果为“移动”

     // 确保当前目标不是正在拖动的元素，并且目标元素是一个LI标签
     if (e.target !== draggingElement && e.target.tagName === "LI") {
       // 获取目标元素的大小和位置
       const targetMsg = e.target.getBoundingClientRect();
       // 计算鼠标在目标元素内部的相对位置
       const mouseY = e.clientY - targetMsg.top;
       const targetHeight = targetMsg.height;

       // 判断鼠标位置以决定插入位置
       if (mouseY < targetHeight / 2) {
         // 如果鼠标在目标元素的上半部分，将拖动元素插入到目标元素之前
         sortableList.insertBefore(draggingElement, e.target);
       } else {
         // 如果鼠标在目标元素的下半部分，将拖动元素插入到目标元素之后
         sortableList.insertBefore(draggingElement, e.target.nextSibling);
       }
     }
   });
   ```

   这段代码为 `sortableList` 添加了一个 `dragover` 事件监听器。它阻止了浏览器的默认行为，并设置了拖放操作的效果。然后它检查当前目标是否是 `LI` 标签且不是正在拖动的元素。接着获取目标元素的大小和位置，计算鼠标在目标元素内部的相对位置，并根据鼠标位置决定将拖动元素插入到目标元素之前或之后。

4. **当拖动结束时触发事件**

   ```javascript
   sortableList.addEventListener("dragend", function (e) {
     e.target.classList.remove("dragging"); // 移除表示正在拖动的类
     draggingElement = null; // 清空拖动元素的存储
   });
   ```

   这段代码为 `sortableList` 添加了一个 `dragend` 事件监听器。当拖动结束时，移除 `dragging` 类，并清空 `draggingElement` 变量。
