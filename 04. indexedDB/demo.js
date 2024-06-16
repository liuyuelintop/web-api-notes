const username = document.querySelector("#username");
const avatar = document.querySelector("#avatar");
const addUserBtn = document.querySelector(".add-user");
const getUserBtn = document.querySelector(".get-user");
const tbody = document.querySelector("tbody");

const request = indexedDB.open("USER", 3);
request.onupgradeneeded = function (e) {
  const db = e.target.result;
  if (!db.objectStoreNames.contains("user")) {
    db.createObjectStore("user");
  }
};
request.onsuccess = function (e) {
  const db = e.target.result;
  addUserBtn.onclick = function () {
    if (username.value && avatar.files.length === 1) {
      const user = {
        name: username.value,
        avatar: avatar.files[0],
      };
      const transaction = db.transaction("user", "readwrite");
      const store = transaction.objectStore("user");
      const r = store.add(user, user.name);
      r.onsuccess = function () {
        console.log("添加成功");
        username.value = null;
        avatar.value = null;
      };
    }
  };
  getUserBtn.onclick = function () {
    const transaction = db.transaction("user");
    const store = transaction.objectStore("user");
    const r = store.getAll();
    r.onsuccess = function (e) {
      // console.log(e.target.result);
      // 进行页面渲染
      const list = e.target.result;
      if (list !== null) {
        list.forEach(({ name, avatar }) => {
          const tr = document.createElement("tr");
          tbody.appendChild(tr);
          tr.innerHTML = `<td>${name}</td>`;
          const fr = new FileReader();
          fr.readAsDataURL(avatar);
          fr.onload = function (e) {
            tr.insertAdjacentHTML(
              "beforeend",
              `<td><img src="${e.target.result}" alt="" /></td>`
            );
          };
        });
      }
    };
  };
};
