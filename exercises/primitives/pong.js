var cnv, score=0, balls = [];

var config = {
    bat : {
      w : 200,
      h : 15,
      r : 7
    },
    ballR : 15,
    speed : 3,
    balls : 6
}

function setup() {
    cnv = createCanvas(windowWidth,windowHeight);
    //cnv.mouseReleased(drawShape);
    background("#42a5f5");
    //drawStage();
}

function randomPosition(){
  return (parseInt(Math.random()*windowWidth),parseInt(Math.random()*windowHeight));
}

function draw() {
  var numOfBalls = balls.length || config.balls;
  background("#42a5f5");
  fill("#ffffff");
  noStroke();
  var posX = windowWidth/2-config.bat.w/2, posY = windowHeight-50;
  rect(posX,posY,config.bat.w,config.bat.h,config.bat.r,config.bat.r,config.bat.r,config.bat.r);
  fill("#000000");
  text(score,windowWidth/2, windowHeight-37);
  fill("#ffffff");
  var ball = {};
  for(var i=0;i<numOfBalls;i++){
    if(balls.length == i){
        ball = {x : randomPosition(), y : randomPosition() , dirx : 1, diry : 1};
        balls.push(ball);
    }else{
        if(balls[i].x >= windowWidth || balls[i].x <=0){
          balls[i].dirx = balls[i].dirx*-1;
        }
        if(balls[i].y >= windowHeight){
          balls.splice(i,1);
          continue;
        }
        if(balls[i].y <=0){
          balls[i].diry = balls[i].diry*-1;
        }
        if( balls[i].x > posX && balls[i].x < posX + config.bat.w && balls[i].y > posY && balls[i].y < posY+config.bat.h ) {
          balls[i].diry = balls[i].diry*-1;
          score += 1;
        }
        balls[i].x += config.speed*balls[i].dirx;
        balls[i].y += config.speed*balls[i].diry;

    }
    ellipse(balls[i].x, balls[i].y, config.ballR);

  }
}
