var hash = [], sorted = [], textX=0, toMove = 0, ctMoved = 0, moving = false;

function setup() {
    loadStrings("resources/poem.txt",processData);
    createCanvas(windowWidth,windowHeight);
}
function draw() {
    background(255);
    translate(textX,height/2);
    for(var i=0;i<sorted.length;i++){
        
        textSize((sorted.length-i) * 1.5);
        text(sorted[i][0],0,0);
        
        var txtWidth = textWidth(sorted[i][0]);
        line(0,5,txtWidth,5);
        translate(txtWidth+10,0);
        
    }
}
//Just trying out 
function moveObject(){
    ctMoved++;
    toMove = textX/4;
    translate(toMove,height/2);  
    moving=true;
    if(ctMoved > 500){
        ctMoved =0;
        moving = false;
    }
}

function processData(data) {
    console.log(data);
    for(var i=0;i<data.length;i++){
         data[i] = data[i].replace(/[.,:]/g,"").trim();
         hash[data[i]] = hash[data[i]] ? hash[data[i]]+1 : 1;
    }
    for(var k in hash){
        //console.log(k + " - " + hash[k]);    
        sorted.push([k,hash[k]]);
    }
    
    sorted.sort(function(a,b){
        //Sort first on frequence and then alphabetically
        return a[1]==b[1] ? (a[0] == b[0] ? 0 : (a[0] < b[0] ? -1 : 1) )  : (a[1]<b[1] ? 1 : -1);
    });
    
    for(var i=0;i<sorted.length;i++){
        console.log(sorted[i][0]+ " - " + sorted[i][1]);    
    }
    
}

function mouseDragged(){
    if(moving)
    return;
    
    textX += mouseX - pmouseX;
}