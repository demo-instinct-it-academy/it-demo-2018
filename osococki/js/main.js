'use strict';
(function () {
  var SPAStateH = {};/*переменная хранит в себе состояние страницы spa*/
  const results = new TAjaxStorage('_Bomberman');
  window.onhashchange = switchToStateFromURLHash;
  window.onload = function () {
    console.log('Страница загружена');
    window._gameStatus = 0;//0-игровое поле не готово, 1-готово
    window._bombStatus = false;//true-есть активная бомба, false-нету
    window._playNow = false;//идёт ли игра сейчас
    window._winStatus = 0;//0-игра не начата либо не окончена, 1 - победа, -1 - поражение
    switchToStateFromURLHash();//установим начальное состояние страницы в зависимости от адр строки
    addSwitchStateListeners('linkHome');//установим прослушивание кликов по ссылкам меню
    addSwitchStateListeners('linkGame');
    addSwitchStateListeners('linkAbout');
    $("#save").click(function(e) {
      e.preventDefault();
      console.log(results);
      results.addValue($("#name").val(), $("#score").val());
      document.getElementById('result').className = 'hide';
    });
  };
  /*Меняет состоягие страницы в зависимости от адресной строки*/
  function switchToStateFromURLHash() {
    var URLHash = window.location.hash;
    var stateJSON = decodeURIComponent(URLHash.substr(1));
    if (stateJSON!=="") {
      SPAStateH = JSON.parse(stateJSON);
    } else {
      SPAStateH = {pagename: 'Main'};
    }
    console.log('Переход на ' + SPAStateH.pagename);
    var pageHTML = document.getElementById("main").getElementsByTagName("h3")[0] || document.createElement('h3');
    var mainPage = document.getElementById('main-page');
    var game = document.getElementById('game');
    var gameRules = document.getElementById('game-rules');
    var about = document.getElementById('about');
    switch ( SPAStateH.pagename )
    {
      case 'Main':
        pageHTML.innerHTML = "Главная страница";
        mainPage.className = 'show';
        game.className = 'hide';
        gameRules.className = 'hide';
        about.className = 'hide';
        break;
      case 'Game':
        pageHTML.innerHTML = "Страница игры";
        mainPage.className = 'hide';
        about.className = 'hide';
        /*Отобразим секции с игрой*/
        if (window._gameStatus === 0) {
          //TODO: тут IE 11 заканчивает свою работу. "createGameField" не определено
          createGameField();
          loadScript('js/grid.js');//в дальнейшем добавим функцию включения и выключения сетки //TODO:
          createGamer();
          window._gameStatus = 1;//Игра готова
        }
        game.className = 'show';
        gameRules.className = 'show';
        break;
      case 'About':
        pageHTML.innerHTML = "О сайте";
        mainPage.className = 'hide';
        game.className = 'hide';
        gameRules.className = 'hide';
        about.className = 'show';
        let array = getAJAXData(results);
        let text ='';
        for (let i = 0; i < array.length; i++) {
          text += (array[i] + '\r\n');
        }
        about.textContent = text;
        break;
      default:
        pageHTML+="<h3>исключение</h3>";
        break;
    }
    var main = document.getElementById('main');
    main.insertBefore(pageHTML, main.firstChild);
  }
  /*Прописывает с адр. строку состояния страницы. Срабатывает при клике. Обрабатывает элемент на котором был клик и
  в замисимости от этого выбирает состояние*/
  function switchToState(evt) {
    var newStateH = evt.target.id;
    switch(newStateH) {
      case 'linkHome':
        newStateH = {pagename: 'Main'};
        break;
      case 'linkGame':
        newStateH = {pagename: 'Game'};
        break;
      case 'linkAbout':
        newStateH = {pagename: 'About'};
        break;
      default:
        break;
    }
  window.location.hash = encodeURIComponent(JSON.stringify(newStateH));
}
  /*Запускает прослушивание события клик по id элемента, отменяя его стандартное поведение*/
  function addSwitchStateListeners(ID) {
    document.getElementById(ID).addEventListener(
      'click', stopDefAction, false
    );
    document.getElementById(ID).addEventListener(
      'click', switchToState, true
    );
  }
  function stopDefAction(evt) {
    evt.preventDefault();
  }
  function loadScript(src){
    var script = document.createElement('script');
    script.src = src;
    script.async = false; // чтобы гарантировать порядок
    document.head.appendChild(script);
  }
  function getAJAXData(data) {
    const keys = data.getKeys();
    console.log(data);
    let list = [];
    for (let i = 0; i < keys.length; i++) {
      list.push(keys[i] + ' ' + data.storage[keys[i]]);
    }
    return list;
  }
}());
