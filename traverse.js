'use strict';

class CellCoords{
  constructor(x, y){
    this.x=x;
    this.y=y;
  }
}

function dfs() {
  let callStack=new Stack();
  callStack.push(new CellCoords(world.config.start.row, world.config.start.col));

  function call(){
      if(!callStack.any())return;
      let x = callStack.peek().x, y=callStack.peek().y;
      world.board.getCell(x, y).status = CellStatus.CLOSED;
      callStack.pop();

      if(canEnterCell(x+1, y)){
        callStack.push(new CellCoords(x+1, y));
        markParent(x+1, y, x, y);
      }
      if(canEnterCell(x-1, y)){
        callStack.push(new CellCoords(x-1, y));
        markParent(x-1, y, x, y);
      }
      if(canEnterCell(x, y+1)){
        callStack.push(new CellCoords(x, y+1));
        markParent(x, y+1, x, y);
      }
      if(canEnterCell(x, y-1)){
        callStack.push(new CellCoords(x, y-1));
        markParent(x, y-1, x, y);
      }
  };

  function recall(){
    if(world.board.getCell(world.config.end.row, world.config.end.col).status == CellStatus.CLOSED){
      setTimeout(colorFoundWay, 0);
      return;
    }
    if(callStack.any()){
      call();
      setTimeout(recall, 3);
    }
  }
  setTimeout(()=>{
    recall();
    colorFoundWay();
  }, 3);
}

function bfs() {
  let queue = new Queue();
  queue.push(new CellCoords(world.config.start.row, world.config.start.col));
  //world.board.getCell(world.config.start.row, world.config.start.col).status = CellStatus.CLOSED;

  function wave(){
    if(world.board.getCell(world.config.end.row, world.config.end.col).status==CellStatus.CLOSED){
      setTimeout(colorFoundWay, world.config.stepWait);
      return;
    }
    if(!queue.any())return;

    let len = queue.getCount();
    for(let i=0;i<len;i++){
      let item = queue.pop();
      let x = item.x, y=item.y;

      if(canEnterCell(x+1, y)){
        queue.push(new CellCoords(x+1, y));
        world.board.getCell(x+1, y).status = CellStatus.CLOSED;
        markParent(x+1, y, x, y);
      }
      if(canEnterCell(x-1, y)){
        queue.push(new CellCoords(x-1, y));
        world.board.getCell(x-1, y).status = CellStatus.CLOSED;
        markParent(x-1, y, x, y);
      }
      if(canEnterCell(x, y+1)){
        queue.push(new CellCoords(x, y+1));
        world.board.getCell(x, y+1).status = CellStatus.CLOSED;
        markParent(x, y+1, x, y);
      }
      if(canEnterCell(1, y-1)){
        queue.push(new CellCoords(x, y-1));
        world.board.getCell(x, y-1).status = CellStatus.CLOSED;
        markParent(x, y-1, x, y);
      }
    }

    if(queue.any())setTimeout(wave, world.config.stepWait);
  }

  setTimeout(()=>{
    wave();
  }, world.config.stepWait);
}
