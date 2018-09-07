class TraverseItem extends PriorityQueueItem{
  constructor(x, y, checkCanMove){
    super();
    this.checkCanMove = checkCanMove;
    this.x = x;
    this.y = y;
  }


  getNext(){
    let result = [];
    let startX=this.startX, startY=this.startY;
    let x=this.x, y=this.y;
    if(this._canMove(x+1, y))result.push(this.makeNext(x+1, y));
    if(this._canMove(x-1, y))result.push(this.makeNext(x-1, y));
    if(this._canMove(x, y+1))result.push(this.makeNext(x, y+1));
    if(this._canMove(x, y-1))result.push(this.makeNext(x, y-1));
    return result;
  }

  makeNext(){
    throw "makeNext not implemented";
  }

  getPriority(){
    throw "getPriority not implemented";
  }

  _canMove(x, y){  return this.checkCanMove(x, y); }
}

class DijkstraTraverseItem extends TraverseItem{
  constructor(x, y, dist, checkCanMove){
    super(x, y, checkCanMove);
    this.dist=dist;
  }

  getPriority(){ return this.dist;  }

  makeNext(x, y){
      return new DijkstraTraverseItem(x, y, this.dist+1, this.checkCanMove);
  }
}

class AStarTraverseItem extends TraverseItem{
  constructor(startX, startY, x, y, checkCanMove){
    super(x, y, checkCanMove);
  }

  getPriority(){
    let distanceToEnd=Math.abs(this.x - world.config.end.row) + Math.abs(this.y - world.config.end.col);
    return distanceToEnd;
  }

  makeNext(x, y){
    return new AStarTraverseItem(this.startX, this.startY, x, y, this.checkCanMove);
  }
}

function dijkstra() {
  priorityQueueTraverse(new DijkstraTraverseItem(
    world.config.start.row, world.config.start.col, 0,
    (x, y)=>canEnterCell(x, y)
  ));
}

function aStar() {
  priorityQueueTraverse(new AStarTraverseItem(
    world.config.start.row, world.config.start.col,
    world.config.start.row, world.config.start.col,
    (x, y)=>canEnterCell(x, y)
  ));
}

function priorityQueueTraverse(from){
  let queue = new PriorityQueue(); 
  //world.board.board[0][0].status = CellStatus.CLOSED;
  queue.push(from);

  let endCell = world.board.getCell(world.config.end.row, world.config.end.col);
  function iterate(){
    if(endCell.status == CellStatus.CLOSED){
      setTimeout(colorFoundWay, 0);
      return;
    }
    if(world.board.endReached)return;
    console.log(queue.getCount());
    let item = queue.pop();
    let nextItems = item.getNext();
    console.log(nextItems);
    nextItems.forEach(x=>{
      queue.push(x);
      world.board.getCell(x.x, x.y).status = CellStatus.CLOSED;
      markParent(x.x, x.y, item.x, item.y);
    });
    if(queue.any())setTimeout(iterate, world.config.stepWait);
  }
  setTimeout(iterate, world.config.stepWait);

  console.log("done");
}
