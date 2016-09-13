var cnv, points = [];

function setup() {
    cnv = createCanvas(windowWidth,windowHeight);
    cnv.mouseReleased(drawShape);
    //background("#cccccc");
}
function draw() {
    //line(30,30,mouseX,mouseY);
    // strokeWeight(5);
    // fill("#999999");
    // rect(mouseX-50,mouseY-50, 100,100,10,10,10,10);
}

function drawShape(){

    points.push([mouseX,mouseY]);
    if(points.length<10){
      clear();
      fill("#cccccc");
      strokeWeight(5);
      stroke("#d32f2f");
      textSize(24);
      if(points.length==1){
        text(""+points[0][0]+","+points[0][1],points[0][0],points[0][1]);
        point(points[0][0],points[0][1]);
      }else {
        beginShape();
        for(var i=0;i<points.length;i++){
          text(""+points[i][0]+","+points[i][1],points[i][0],points[i][1]);
          vertex(points[i][0],points[i][1]);
        }
        if(points.length >= 3 ){
          endShape(CLOSE);
        }else{
          endShape();
        }
      }
    }

}
