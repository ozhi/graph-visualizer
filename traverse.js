'use strict';

function dfs() {
  alert('Depth-first search not implemented yet');
}

function bfs() {
  const start = world.board.getCell(world.config.start.row, world.config.start.col);

  start.parent = undefined;
  start.distFromStart = 0;
  const cellsQueue = [start];

  traverse(cellsQueue);
}

function traverse(cellsToVisit) {
  if (cellsToVisit.length === 0 || world.board.endReached) {
    return;
  }

  const cell = cellsToVisit.shift();

  console.log('Visiting (%d, %d)', cell.row, cell.col);
  cell.status = CellStatus.CLOSED;

  if (cell.row === world.config.end.row && cell.col === world.config.end.col) {
    console.log('The end was reached');
    world.board.endReached = true;
    colorFoundWay();
  }

  const neighbors = getNeighbors(cell);

  for (let i = 0; i < neighbors.length; i++) {
    const neighbor = neighbors[i];
    if (neighbor.status === CellStatus.UNREACHED) {
      cellsToVisit.push(neighbor);
      neighbor.status = CellStatus.OPEN;
      neighbor.parent = cell;
      neighbor.distFromStart = cell.distFromStart + 1;
    }
  }

  setTimeout(() => {
    traverse(cellsToVisit);
  }, world.config.stepWait);
}
