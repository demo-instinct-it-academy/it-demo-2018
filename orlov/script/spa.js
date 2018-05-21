'use strict';

function showPage(pageId) {
  $('.page').hide();
  $(pageId).show();
}

if (location.hash === '') {
  location.hash = '#menu';
} else {
  showPage(location.hash);
}

$(window).on('hashchange', function () {
  showPage(location.hash);
});



