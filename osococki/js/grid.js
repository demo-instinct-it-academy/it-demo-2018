'use strict';
const obj = document.querySelector('#game');
const nameSpace = 'http://www.w3.org/2000/svg';
obj.appendChild(createSVGLines());
console.log('Игровая сетка добавлена...')
function createSVGLines() {
  const svg = document.createElementNS(nameSpace, 'svg');
  svg.setAttribute("width", area.gameWidth);
  svg.setAttribute("height", area.gameHeight);
  svg.appendChild(createLines());
  return svg;
}
function createLines() {
  const grid = TArea.gameGridSize();
  const lines = document.createElementNS(nameSpace, 'g');
  for (let i = 1; i < grid[0]; i++) {
    let line = document.createElementNS(nameSpace, 'line');
    line.setAttribute("x1", area.getCoordsOfBlock(0, i)[0]);
    line.setAttribute("y1", area.getCoordsOfBlock(0, i)[1]);
    line.setAttribute("x2", area.getCoordsOfBlock(grid[1], i)[0]);
    line.setAttribute("y2", area.getCoordsOfBlock(grid[1], i)[1]);
    line.setAttribute("stroke", "#8484FF");
    line.setAttribute("stroke-width", "1");

    lines.appendChild(line);
  }
  for (let i = 1; i < grid[1]; i++) {
    let line = document.createElementNS(nameSpace, 'line');
    line.setAttribute("x1", area.getCoordsOfBlock(i, 0)[0]);
    line.setAttribute("y1", area.getCoordsOfBlock(i, 0)[1]);
    line.setAttribute("x2", area.getCoordsOfBlock(i, grid[0])[0]);
    line.setAttribute("y2", area.getCoordsOfBlock(i, grid[0])[1]);
    line.setAttribute("stroke", "#8484FF");
    line.setAttribute("stroke-width", "1");

    lines.appendChild(line);
  }

  return lines;
}
