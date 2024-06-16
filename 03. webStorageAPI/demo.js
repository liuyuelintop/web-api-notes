const THEME = "__THEME__";
const GREEN_THEME = "green-theme";
const data = localStorage.getItem("__THEME__");
document.body.classList.add(data);
document.querySelector("button").addEventListener("click", () => {
  if (document.body.classList.contains(GREEN_THEME)) {
    document.body.classList.remove(GREEN_THEME);
    localStorage.removeItem("__THEME__");
  } else {
    document.body.classList.add(GREEN_THEME);
    localStorage.setItem(THEME, GREEN_THEME);
  }
});
