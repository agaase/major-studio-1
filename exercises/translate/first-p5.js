function setup() {
    createCanvas(windowWidth,windowHeight);
}
function draw() {
    clear();
    stroke("#000000");
    push();
    translate(150,150);
    rotate(radians(mouseX));
    rect(-50,-50,100,100);
    pop();
    translate(100,100);
    //rotate(radians(45));
    rect(0,0,100,100);
}
