var c1 = function(p){

  p.setup = function(){
    p.createCanvas(400,300);
  }

  p.draw = function(){
    p.background("rgb(199, 228, 165)");
    p.ellipse(canvas2.mouseX, canvas2.mouseY, 30, 30);
  }
}

var c2 = function(p){

  p.setup = function(){
    p.createCanvas(400,300);
  }

  p.draw = function(){
    p.background("rgb(113, 178, 201)");
    p.ellipse(canvas1.mouseX, canvas2.mouseY, 30, 30);
  }
}

var canvas1 = new p5(c1);
var canvas2 = new p5(c2);
