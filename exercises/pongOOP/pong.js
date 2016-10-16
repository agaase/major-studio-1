  var cnv, score=0, balls = [], gameOver = false, batX, batY;



var config = {
    bat : {
      w : 200,
      h : 15,
      r : 7
    },
    ballR : 15,
    speed : 4,
    balls : 6,
    batSpeed : 60
}

function setup() {
    cnv = createCanvas(windowWidth,windowHeight);
    batX = windowWidth/2-config.bat.w/2;
    batY = windowHeight-50;
}

function randomPosition(){
  return (parseInt(Math.random()*windowWidth),parseInt(Math.random()*windowHeight));
}

function keyPressed() {
  debugger;
  if (keyCode == RIGHT_ARROW) {
    if((batX + config.bat.w + config.batSpeed)<windowWidth){
        batX += config.batSpeed;
    }
  } else if (keyCode == LEFT_ARROW) {
    if((batX-config.batSpeed)>0){
      batX -= config.batSpeed;
    }
  }
  return false; // prevent default
}

function draw() {
  if(gameOver){
    return;
  }
  var numOfBalls = balls.length || config.balls;
  background("#42a5f5");
  fill("#ffffff");
  noStroke();

  rect(batX,batY,config.bat.w,config.bat.h,config.bat.r,config.bat.r,config.bat.r,config.bat.r);
  fill("#000000");
  text(score,batX+config.bat.w/2, batY+10);
  fill("#ffffff");
  var ball = {};
  for(var i=0;i<numOfBalls;i++){
    if(balls.length == i){
        ball = {x : randomPosition(), y : randomPosition() , dirx : 1, diry : 1};
        balls.push(ball);
    }else{
        if(balls[i].x >= windowWidth || balls[i].x <=0){
          ac

          balls[i].dirx = balls[i].dirx*-1;
        }
        if(balls[i].y >= windowHeight){
          //When the balls cross the height of the window
          balls.splice(i,1);
          if(!balls.length){
            gameOver = true;
          }
          break;
        }
        if(balls[i].y <=0){
          balls[i].diry = balls[i].diry*-1;
        }
        if( balls[i].x > batX && balls[i].x < batX + config.bat.w && balls[i].y > batY && balls[i].y < batY+config.bat.h ) {
          balls[i].diry = balls[i].diry*-1;
          score += 1;
        }
        balls[i].x += config.speed*balls[i].dirx;
        balls[i].y += config.speed*balls[i].diry;
    }
    ellipse(balls[i].x, balls[i].y, config.ballR);
  }
  //Game over
  if(gameOver){
    textSize(44);
    text("GAME OVER",windowWidth/2-100, windowHeight/2);
  }
}
