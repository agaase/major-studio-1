var opc  = ["FF","F2","E6","D9","CC","BF","B3","A6","99","8C","80","73","66","59","4D","40","33","26","1A","0D","00"];
var rectH;
var rectW;

function setup() {
  createCanvas(windowHeight,windowHeight);
  stroke("none");
  rectH = windowHeight/20;
  rectW = windowHeight/80;
  //v2();
  v1();

}


function v1(){
  for(var i=0;i<20;i++){
    for(var j=0;j<79;j++){
      fill("#cccccc");
      rect(j*rectW,i*rectH,rectW,rectH);
      var transparency = parseInt(Math.random()*100);
       //fill("#"+opc[parseInt(Math.random()*18)]+"000000");
       fill("#000");
      if(i>8 && j>29 && j<70 && i<15 ){
        fill("rgba(255, 0, 0, "+(0.3+Math.random())+")");
        rect(j*rectW,i*rectH,rectW,rectH);
      }else{
        fill("rgba(255, 0, 0, "+Math.random()+")");
        rect(j*rectW,i*rectH,rectW,rectH);
      }

    }
  }
}

function v2(){
  for(var i=0;i<20;i++){
    for(var j=0;j<79;j++){
      fill("#cccccc");
      rect(j*rectW,i*rectH,rectW,rectH);
      var transparency = parseInt(Math.random()*100);
       //fill("#"+opc[parseInt(Math.random()*18)]+"000000");
       fill("#000");
      if(i>8 && j>29 && j<70 && i<15 ){
        //fill("rgba(255, 0, 0, "+(0.3+Math.random())+")");
        rect(j*rectW,i*rectH,rectW,rectH*(Math.random()+0.3));
        //rect(j*rectW,i*rectH,rectW,rectH);
      }else{
        //fill("rgba(255, 0, 0, "+Math.random()+")");
        //rect(j*rectW,i*rectH,rectW,rectH*Math.random());
        rect(j*rectW,i*rectH,rectW,rectH*(Math.random()));
      }

    }
  }
}
function draw() {

}
