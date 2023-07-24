window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  const button = document.querySelector(".button-scroll-to-top");
  if (
    document.body.scrollTop > 400 ||
    document.documentElement.scrollTop > 400
  ) {
    button.style.opacity = "1";
    button.style.visibility = "visible";
  } else {
    button.style.opacity = "0";
    button.style.visibility = "hidden";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
