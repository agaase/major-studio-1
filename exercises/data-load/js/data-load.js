function setup() {
  
  createCanvas(windowWidth,windowHeight);
  loadTSV();
  showJSON();

}

var loadTSV = function(){
  loadTable("groceries.tsv","tsv","header",function(data){
      var count = data.getRowCount();
      var rowHeight = height/count;
      
      for(var i=0;i<count;i++){
        var amount = data.getString(i,0);
        var unit = data.getString(i,1);
        var item = data.getString(i,2);
        var source = data.getString(i,3);
        
        if(source === "market"){
            fill("#BBDEFB");
        }else{
            fill("#C0CA33");
        }
        textSize(32);
        text(amount + ' ' + unit + ' ' + item + " - " + source,100, 100 + rowHeight * (i+1));
        
      }
  })
};

var showJSON = function(){
  loadJSON("colors.json",function(colors){
    var posx = 125;
    for(var color in colors){
      fill(color);
      noStroke();
      ellipse(posx, 100,50,50);
      posx += 60;
    }
  });
}