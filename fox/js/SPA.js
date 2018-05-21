'use strict';

window.onhashchange = switchToStateFromUrlHash;

function setAttributesToLinks() {
  $('li a').each(function () {
    $(this).attr('href', `#${$(this).text()}`);
    $(this).attr('id', `#${$(this).text()}`);
  });
  $('h1 a').attr('href', '#main');
}

function switchToStateFromUrlHash() {
  let page = window.location.hash.substr(1);
  if (page === '') {
    page = 'main';
  }

  switch (page) {
    case 'main':
      setAttributesToLinks();
      document.getElementById('main').style.display ='block';
      document.getElementById('play').style.display = 'none';
      document.getElementById('results').style.display = 'none';
      document.getElementById('about').style.display = 'none';
      break;
    case 'play':
      setAttributesToLinks();
      document.getElementById('main').style.display = 'none';
      document.getElementById('play').style.display = 'block';
      document.getElementById('results').style.display = 'none';
      document.getElementById('about').style.display = 'none';
      break;
    case 'results':
      setAttributesToLinks();
      document.getElementById('main').style.display ='none';
      document.getElementById('play').style.display = 'none';
      document.getElementById('results').style.display = 'block';
      document.getElementById('about').style.display = 'none';
      break;
    case 'about':
      setAttributesToLinks();
      document.getElementById('main').style.display = 'none';
      document.getElementById('play').style.display = 'none';
      document.getElementById('results').style.display = 'none';
      document.getElementById('about').style.display = 'block';
      break;
    default:
      document.getElementById('main').style.display ='block';
      document.getElementById('play').style.display = 'none';
      document.getElementById('results').style.display = 'none';
      document.getElementById('about').style.display = 'none';
      break;
  }
}

switchToStateFromUrlHash();