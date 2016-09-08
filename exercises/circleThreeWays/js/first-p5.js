function setup() {
  createCanvas(200,200);
}
var ct=0;

var randomColor = function(code){
    code = code || "#";
    if(code.length==7){
      return code;
    }
    var digits = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
    code += digits[Math.floor(Math.random()*6)];
    return randomColor(code);
};
function draw() {
  var colo = randomColor();
  var c = color(colo);
  fill(c);
  noStroke();
  ellipse(100, 100, 200, 200);
}
