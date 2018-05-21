'use strict';
// вырубаю перетаскивание изображений ( кнопок );
$("img, a").on("dragstart", function(event) { event.preventDefault(); });
