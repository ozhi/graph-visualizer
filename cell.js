'use strict';

const CELL_WIDTH = 16;
const CELL_HEIGHT = 16;

const CellStatus = {
  WALL: 'wall',
  UNREACHED: 'unreached', // initial state
  OPEN: 'open', // set when the algorithm reaches the cell
  CLOSED: 'closed', // set when the algorithm finishes considering the cell
  MARKED: 'marked' // set only after the algorithm is done, used to mark the found way
};

class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.clear();
  }
}

Cell.prototype.clear = function() {
  this.status = CellStatus.UNREACHED;

  this.distFromStart = undefined;
  this.estimatedDistToEnd = undefined;
  this.parent = undefined;
}

Cell.prototype.draw = function() {
  let color;

  if (this.row === world.config.start.row && this.col === world.config.start.col) {
    color = '#FF0000'; // start is red
  } else if (this.row === world.config.end.row && this.col === world.config.end.col) {
    color = '#00FF00'; // end is green
  } else if (this.status === CellStatus.WALL) {
    color = 'Black';
  } else if (this.status === CellStatus.UNREACHED) {
    color = 'LightGrey';
  } else if (this.status === CellStatus.OPEN) {
    color = 'Orange';
  } else if (this.status === CellStatus.CLOSED) {
    color = getColorByDistance(this);
  } else if (this.status === CellStatus.MARKED) {
    color = 'Blue';
  }

  world.ctx.fillStyle = color;

  world.ctx.beginPath();
  world.ctx.fillRect(
    this.col * CELL_WIDTH + 1,
    this.row * CELL_HEIGHT + 1,
    CELL_WIDTH - 2,
    CELL_HEIGHT - 2);
  world.ctx.fill();
}

function isStart(cell) {
  return cell.row === world.config.start.row && cell.col === world.config.start.col;
}

function getColorByDistance(cell) {
  const startToEndDist =
    Math.hypot(world.config.start.row - world.config.end.row, world.config.start.col - world.config.end.col);

    const maxDist = Math.hypot(world.config.rows, world.config.cols);
  const cellToEndDist = Math.hypot(cell.row - world.config.end.row, cell.col - world.config.end.col);
  const coef = cellToEndDist / maxDist;

  const red = [255, 0, 0];
  const green = [0, 255, 0];
  const color = [];

  for (let i in red) {
    color[i] = green[i] + (red[i] - green[i]) * coef;

    color[i] = Math.floor(color[i]).toString(16);
    if (color[i].length === 1) {
      color[i] = '0' + color[i];
    }
  }

  return '#' + color.join('');
}
