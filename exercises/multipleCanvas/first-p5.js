var c = [];

function setup(){
  loadTable("LaborInNonAgricultSector.txt","tsv","header",showData);
}

 var minn = Number.MAX_VALUE;
var maxx = 0;

function showData(data){
 
  var count = data.getRowCount();
  for(var row=0;row<count; row++){
    for(var col=3;col<data.getColumnCount();col++){
      var val = data.getString(row,col);
      if(val){
        val = parseFloat(val); 
        if(val < minn){
          minn = val;
        }
        if(val > maxx){
          maxn = val;
        }  
      }
      //console.log(value);
    }
  }
  
  for(var row=0;row<count; row++){
    c[row] = newCanvas(data,row);
    for(var col=3;col<data.getColumnCount();col++){
    }
  }
}


function newCanvas(data, row){
  debugger;
  var c = function(p){
    var width=400;
    var height = 300;
    p.setup = function(){
      p.createCanvas(400,300);
      p.rect(0,0,width-1,height-1);
      p.text(data.getString(row,0),10,20);
      p.beginShape();
      for(var col=3;col<data.getColumnCount();col++){
        var value = data.getString(row,col);
        value = value ? parseFloat(value) : 0;
        p.vertex(map(col,3,25,0,width),map(value,minn,maxx,0,height));
      }
      p.endShape(CLOSE);
    }
  
    p.draw = function(){
      // p.background("rgb(113, 178, 201)");
      // p.ellipse(canvas1.mouseX, canvas2.mouseY, 30, 30);
    }
  }
  
  
  var myCanvas = new p5(c);
  
  return myCanvas;

}
