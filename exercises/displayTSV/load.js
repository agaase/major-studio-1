function setup() {
    cnv = createCanvas(windowWidth,windowHeight);
    loadTable("data/LaborInNonAgricultSector.txt","tsv","header",showData);
}
function draw() {
    
}
function showData(data) {
    var rows = data.getRowCount();
    var cols = data.getColumnCount();
    var row,col, val, minVal, maxVal;
    for(row = 0; row<rows; row++){
        
        for(col=3; col<cols;col++){
            val = parseFloat(data.getString(row,col));
            if(!minVal || val<minVal){
                minVal = val;
            }
            if(!maxVal || val > maxVal){
                maxVal = val;
            }
        }
    }
    
    text(minVal, 50, map(minVal,minVal,maxVal,height,0));
    text(maxVal, 50, map(maxVal,minVal,maxVal,height,0));
    
    for(row = 0; row<rows; row++){
        stroke(randomColor());
        beginShape();
        for(col=3; col<cols;col++){
            val = parseFloat(data.getString(row,col));
            vertex(map(col,3,25,0,width),map(val,minVal,maxVal,height,0));
        }
        endShape();
    }
}

var randomColor = function(code){
    code = code || "#";
    if(code.length==7){
      return code;
    }
    var digits = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
    code += digits[Math.floor(Math.random()*6)];
    return randomColor(code);
};