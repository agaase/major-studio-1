var id;
var slider;

function setup() {
  id = select('#an_id');
  id.mousePressed(handleClick);
  slider = createSlider(0,255,100);
  slider.position(100,100);
  slider.style("width","80px");
  slider.changed(handleChange);
  noCanvas();
}
function draw() {
}

function handleClick(){
  //alert("Hey! How are you!");
  id.style("color","rgb(94, 148, 182)");

}

function handleChange(){
  id.position(slider.value(), windowHeight/2);
}
