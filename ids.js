'use strict';

// Iterative-deepening search
async function ids() {
  for (let maxDepth = 5; !world.board.endReached; maxDepth += 5) {
    clearReachedCells();
    const start = world.board.getCell(world.config.start.row, world.config.start.col);
    start.distFromStart = 0;
    await dls([start], maxDepth);
  }
}

// Depth-limited search
async function dls(cellsToVisit, maxDepth) {
  world.board.draw();

  if (world.board.endReached || cellsToVisit.length === 0) {
    return;
  }

  const cell = cellsToVisit.pop(); // FIFO => depth-first search

  console.log('Visiting (%d, %d)', cell.row, cell.col);
  cell.status = CellStatus.CLOSED;

  if (cell.row === world.config.end.row && cell.col === world.config.end.col) {
    console.log('The end was reached');
    world.board.endReached = true;
    colorFoundWay();
    return;
  }

  if (cell.distFromStart < maxDepth) {
    getNeighbors(cell)
      .filter(neighbor => neighbor.status === CellStatus.UNREACHED)
      .forEach(neighbor => {
        cellsToVisit.push(neighbor);
        neighbor.parent = cell;
        neighbor.distFromStart = cell.distFromStart + 1;
      });
  }

  await sleep(world.config.stepWait);
  await dls(cellsToVisit, maxDepth);
}

function clearReachedCells() {
  for (let i = 0; i < world.config.rows; i++) {
    for (let j = 0; j < world.config.cols; j++) {
      const cell = world.board.getCell(i, j);
      if (cell.status === CellStatus.OPEN || cell.status === CellStatus.CLOSED) {
        cell.clear();
      }
    }
  }
  console.log('Reached cells were cleared');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
