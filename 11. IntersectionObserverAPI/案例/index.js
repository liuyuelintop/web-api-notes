document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.onload = () => observer.unobserve(img); // 确保图像加载后停止观察
      }
    });
  }, observerOptions);

  document
    .querySelectorAll("img[data-src]")
    .forEach((img) => observer.observe(img));
});
