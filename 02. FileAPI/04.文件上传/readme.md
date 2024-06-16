### Core Summary of Implementing Drag-and-Drop File Upload

#### 1. HTML Structure

- Create a file drop area (`dropContent`) and a file input element (`fileInput`).
- Add necessary buttons or other trigger elements.

```html
<div class="drop-content">Drop files here</div>
<input type="file" class="file" multiple style="display: none;" />
```

#### 2. Styling

- Style the drop area to make it visibly distinct and attract users to drag and drop files into it.
- Hide the file input element, but keep it accessible via JavaScript to trigger click events.

```css
.drop-content {
  width: 200px;
  height: 200px;
  border: 2px dashed #000;
}
```

#### 3. JavaScript Logic

- Select necessary DOM elements.
- Add event listeners for the drop area and file input element.

```javascript
const dropContent = document.querySelector(".drop-content");
const fileInput = document.querySelector("input.file");
const tempFileList = []; // To store the file list
```

#### 4. Drag-and-Drop Event Handling

- Prevent the default behavior of the `dragover` event to allow dropping files into the drop area.
- Handle the `drop` event by reading the files or folders that are dragged in.

```javascript
dropContent.addEventListener("dragover", (e) => e.preventDefault());

dropContent.addEventListener("drop", (e) => {
  e.preventDefault();
  for (const item of e.dataTransfer.items) {
    getFileByEntry(item.webkitGetAsEntry());
  }
});
```

#### 5. Recursively Reading Folder Contents

- Use `webkitGetAsEntry` to get the file system entry of the dragged item.
- Differentiate between files and folders, reading files directly and recursively reading folder contents.

```javascript
function getFileByEntry(entry, path = "") {
  if (entry.isFile) {
    entry.file((file) => {
      file.path = `${path}${file.name}`;
      tempFileList.push(file);
      renderFilelist();
    });
  } else {
    const reader = entry.createReader();
    reader.readEntries((entries) => {
      for (const item of entries) {
        getFileByEntry(item, `${path}${entry.name}/`);
      }
    });
  }
}
```

#### 6. Rendering the File List

- Update the display of the dragged file list, including file name, path, type, and size.

```javascript
function renderFilelist() {
  const list = document.querySelector("tbody");
  list.innerHTML = "";
  tempFileList.forEach((file, index) => {
    const tr = document.createElement("tr");
    list.appendChild(tr);
    tr.innerHTML = `
      <td>${file.name}</td>
      <td>${file.webkitRelativePath || file.path}</td>
      <td>${file.type}</td>
      <td>${transformByte(file.size)}</td>
      <td onclick=delFile(${index})>Delete</td>
    `;
  });
}

function transformByte(size) {
  if (size < 1024 ** 2) {
    return (size / 1024).toFixed(1) + "KB";
  } else if (size < 1024 ** 3) {
    return (size / 1024 ** 2).toFixed(1) + "MB";
  } else {
    return (size / 1024 ** 3).toFixed(1) + "GB";
  }
}
```

#### 7. Deleting Files

- Provide a delete function to remove files from the list.

```javascript
function delFile(index) {
  tempFileList.splice(index, 1);
  renderFilelist();
}
```

### Core Summary

- **HTML Structure**: Define the drop area and file input elements.
- **Styling**: Make the drop area visibly distinct.
- **Event Handling**: Add `dragover` and `drop` event listeners to the drop area.
- **Recursively Reading Folders**: Handle the logic for reading both files and folders recursively.
- **Rendering File List**: Update the display of the dragged file list.
- **File Operations**: Provide functions to delete files.

By following these steps, you can implement a complete drag-and-drop file upload feature that supports single files, multiple files, and folder drag-and-drop uploads.
