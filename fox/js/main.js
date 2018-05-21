'use strict';


const g = new Game();
g.showResults();

$("#main li a").mouseover(function () {

  $(this).fadeTo("slow", 0.92);

});
$("#main li a").mouseout(function () {

  $(this).fadeTo("slow", 1);

});

const btns = document.querySelectorAll('.blue');
for(let i = 0; i < btns.length; i++) {
  if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
    btns[i].style.display = "none";
  }
}

window.addEventListener("DOMContentLoaded",g.start());

