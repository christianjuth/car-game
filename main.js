let gameState = {
  map: [
    [1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1],
    [1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1],
    [1,1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,1,1],
    [1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1],
    [1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,1,0,0,1,1],
    [1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1],
    [1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1],
    [1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1],
    [0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1],
    [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
    [1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,1,0,0,0,0],
    [1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1],
    [1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1],
    [1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1],
    [1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1],
    [1,1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,1,1],
    [1,1,0,0,1,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1],
    [1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0],
  ],
  player: {
    loc: {
      x: 10,
      y: 15,
      direction: 'n'
    }
  },
  computers: [
    {
    loc: {
      x: 3,
      y: 5,
      direction: 'n'
    },
    points: [{
      x: 3,
      y: 1
    },{
      x: 2,
      y: 1
    },{
      x: 2,
      y: 18
    },{
      x: 3,
      y: 18
    }]
  },{
    loc: {
      x: 16,
      y: 14,
      direction: 's'
    },
    points: [{
      x: 16,
      y: 18
    },{
      x: 17,
      y: 18
    },{
      x: 17,
      y: 1
    },{
      x: 16,
      y: 1
    }]
  }
  ]
}



let canvas,
    ctx,
    scale = 25,
    img,
    step = 0.05,
    move = 'u';

let setup = () => {
  canvas = document.getElementById("myCanvas");
  images = {
    player: {
      e: document.getElementById('player-e'),
      w: document.getElementById('player-w'),
      n: document.getElementById('player-n'),
      s: document.getElementById('player-s'),
    },
    computer: {
      e: document.getElementById('computer-e'),
      w: document.getElementById('computer-w'),
      n: document.getElementById('computer-n'),
      s: document.getElementById('computer-s'),
    }
  }
  ctx = canvas.getContext("2d");
  document.onkeydown = controller;

  render();

  setInterval(() => {
    let { computers, player } = gameState;
    computers.forEach(calculateMove);
    movePlayer(player, move);
  }, 1000/60);
}

let calculateMove = (player, loc) => {
  let origin = player.loc,
      dest = player.points[0],
      move;

  let yDiff = origin.y - dest.y,
      xDiff = origin.x - dest.x;

  if(yDiff > 0 && Math.abs(yDiff) > step)
    move = 'u';
  else if(yDiff < 0 && Math.abs(yDiff) > step)
    move = 'd';
  else if(xDiff > 0 && Math.abs(xDiff) > step)
    move = 'l';
  else if(xDiff < 0 && Math.abs(xDiff) > step)
    move = 'r';
  else{
    // shift points and restart function
    player.points.push(player.points.shift())
    calculateMove(player, loc);
    return;
  }

  movePlayer(player, move);
}

let movePlayer = (player, move) => {
  if(move.direction == '') return;
  let loc = Object.assign({}, player.loc);

  // up arrow
  if (move == 'u'){
    if(loc.direction !== 'n')
      loc.y -= 1;
    else
      loc.y -= step;
    loc.x = Math.round(loc.x);
    loc.direction = 'n';
  }

  // down arrow
  else if (move == 'd'){
    if(loc.direction !== 's')
      loc.y += 1;
    else
      loc.y += step;
    loc.x = Math.round(loc.x);
    loc.direction = 's';
  }
  // left arrow
  else if (move == 'l'){
    if(loc.direction !== 'w')
      loc.x -= 1;
    else
      loc.x -= step;
    loc.y = Math.round(loc.y);
    loc.direction = 'w';
  }

  // right arrow
  else if (move == 'r'){
    if(loc.direction !== 'e')
      loc.x += 1;
    else
      loc.x += step;
    loc.y = Math.round(loc.y);
    loc.direction = 'e';
  }

  // validate move
  if(!willColide(loc)){
    player.loc = loc;
    render();
  }
}



let willColide = (loc) => {
  let { map } = gameState,
      { x, y } = loc,
      firstCord = Object.assign({}, loc),
      secondCord = Object.assign({}, loc),
      height = map.length,
      width = map[0].length;

  try{
    if(loc.direction == 'n'){
      firstCord.y = Math.floor(y);
      secondCord.y = Math.floor(secondCord.y) + 1;
    }
    else if(loc.direction == 's'){
      firstCord.y = Math.ceil(y) - 1;
      secondCord.y = Math.ceil(secondCord.y);
    }
    else if(loc.direction == 'e'){
      firstCord.x = Math.ceil(x) - 1;
      secondCord.x = Math.ceil(secondCord.x);
    }
    else{
      firstCord.x = Math.floor(x);
      secondCord.x = Math.floor(secondCord.x) + 1;
    }

    if([1, undefined, null].includes(map[firstCord.y][firstCord.x]))
      return true;
    if([1, undefined, null].includes(map[secondCord.y][secondCord.x]))
      return true;
  } catch(e) {
    return true;
  }

  return false;
}


let controller = (e) => {
  e = e || window.event;
  let { player, map } = gameState,
      loc = Object.assign({}, player.loc);

  move = ['u','d','l','r'][[38,40,37,39].indexOf(e.keyCode)];

  // validate move
  if(!willColide(loc)){
    player.loc = loc;
    render();
  }
}


let render = () => {
  let { map, player, computers } = gameState;

  ctx.clearRect(0, 0, 500, 500);

  // map.forEach((row, y) => {
  //   row.forEach((cell, x) => {
  //     ctx.beginPath();
  //     if(cell == 1){
  //       ctx.fillStyle = 'rgba(0,0,0,0.5)';
  //       ctx.rect(scale*x, scale*y, scale, scale);
  //       ctx.fill();
  //     }
  //     else
  //       ctx.clearRect(scale*x, scale*y, scale, scale);
  //   });
  // });

  let renderPlayer = (player, type) => {
    let { x, y, direction } = player.loc,
        height = scale,
        width = scale,
        xOffset = 0;
        yOffset = 0

    if(['n', 's'].includes(direction))
      height *= 2;

    else
      width *= 2;

    let selectedImg = images[type][direction];

    // ctx.beginPath();
    // ctx.rect(scale*x, scale*y, scale, scale);
    // ctx.fillStyle = color;
    // ctx.fill();

    if(direction == 'n')
      ctx.drawImage(selectedImg, scale*x - width/2, scale*y, width*2, height);
    else if(direction == 's')
      ctx.drawImage(selectedImg, scale*x - width/2, scale*(y-1), width*2, height);
    else if(direction == 'e')
      ctx.drawImage(selectedImg, scale*(x-1), scale*y - height/2, width, height*2);
    else
      ctx.drawImage(selectedImg, scale*x, scale*y - height/2, width, height*2);

  }

  renderPlayer(player, 'player');
  computers.forEach((c) => renderPlayer(c, 'computer'));

}


setup();
