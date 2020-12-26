var slideIndex = 1;
goster(slideIndex);

function sonraki(n) {
  goster(slideIndex += n);
}

function mevcut(n) {
  goster(slideIndex -= n);
}

function goster(n) {
  var i;
  var slider1 = document.getElementsByClassName("slider");
  var nokta1 = document.getElementsByClassName("nokta");
  if (n > slider1.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slider1.length}
  for (i = 0; i < slider1.length; i++) {
    slider1[i].style.display = "none";  
  }
  for (i = 0; i < nokta1.length; i++) {
    nokta1[i].className = nokta1[i].className.replace(" active", "");
  }
  slider1[slideIndex-1].style.display = "block";  
  nokta1[slideIndex-1].className += " active";
}
