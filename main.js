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
  var slider = document.getElementsByClassName("slider");
  var nokta = document.getElementsByClassName("nokta");
  if (n > slider.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slider.length}
  for (i = 0; i < slider.length; i++) {
    slider[i].style.display = "none";  
  }
  for (i = 0; i < nokta.length; i++) {
    nokta[i].className = nokta[i].className.replace(" active", "");
  }
  slider[slideIndex-1].style.display = "block";  
  nokta[slideIndex-1].className += " active";
}
