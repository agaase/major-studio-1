var countriesInAfrica = {}, conflictsPerYrPerCountry = {}, bgImg, selectedYr, startingYear = 1952, pointsArray = [];

var colors = ["#FFF176","#FFB74D","#E57373","#F44336","#B71C1C","#69020F","#FFFFFF"];
var colorFatalities = ["< 1k","1-2k","2-3k","3-4k","4-5k","> 5k","genocide"];

function setup() {
  var cnv = createCanvas(windowWidth,windowHeight);
  cnv.mousePressed(handleClick);
  $("body").append("<div class='footnote'> © Aseem Agarwal | Data source : Uppsala Conflict Data Program (ucdp.uu.se)</div>");
  /*loadImage("images/world_map.jpg",function(img){
      //image(img, 0, 0, windowHeight*1.503 , windowHeight);
      bgImg =  img;
  });
  */


  prepareCountryData(function(){
    loadTable("data/active/ucdp_armed_conflict.csv","csv","header",function(data){
        var count = data.getRowCount();
        var rowHeight = height/count;
        for(var i=0;i<count;i++){
          var year = data.getString(i,1);
          var loc = data.getString(i,2);
          var intensity = data.getString(i,10);
          fill("#000000");
          textSize(16);
          addConflictEvent(year,loc,intensity);
        }
        loadTable("data/active/ucdp-onesided-14-2016.csv","csv","header",function(data){
          var count = data.getRowCount();
          var rowHeight = height/count;

          for(var i=0;i<count;i++){
            var year = data.getString(i,1);
            var loc = data.getString(i,8);
            var locs = loc.split(",");
            var fatalities = parseFloat(data.getString(i,4));
            if(locs.length>1){
                fatalities = Math.round(fatalities/locs.length);
                var intensity = Math.round(fatalities/1000)+1;
                for(var k=0;k<locs.length;k++){
                  addConflictEvent(year,locs[k].trim(),intensity);
                }
            }else{
                addConflictEvent(year,loc,Math.round(fatalities/1000)+1);
            }
          }
          loadTable("data/active/ucdp-nonstate.csv","csv","header",function(data){
            var count = data.getRowCount();
            var rowHeight = height/count;
            for(var i=0;i<count;i++){
              var year = data.getString(i,15);
              var loc = data.getString(i,19);
              var locs = loc.split(",");
              var fatalities = parseFloat(data.getString(i,16));
              if(locs.length>1){
                  fatalities = parseFloat(data.getString(i,16));
                  fatalities = Math.round(fatalities/locs.length);
                  var intensity = Math.round(fatalities/1000)+1;
                  for(var k=0;k<locs.length;k++){
                    addConflictEvent(year,locs[k].trim(),intensity);
                  }
              }else{
                  addConflictEvent(year,loc,Math.round(fatalities/1000)+1);
              }
            }
            drawInitialVisualization();
            //drawHistogram();

          });
        });
    })
  });
}

function addConflictEvent(year,loc,intensity){
  if(countriesInAfrica[loc]){
      //console.log(year + '-' + loc + '-' + intensity);
      if(conflictsPerYrPerCountry[year]){
        if(conflictsPerYrPerCountry[year][loc]){
            conflictsPerYrPerCountry[year][loc] += parseInt(intensity);
        }else{
            conflictsPerYrPerCountry[year][loc] = parseInt(intensity);
        }
      }
      else{
        conflictsPerYrPerCountry[year] = {};
        conflictsPerYrPerCountry[year][loc] = parseInt(intensity);
      }
  }
}


function prepareCountryData(callback){
    loadJSON("data/active/countries_longlat.json",function(cll){
        for(var i=0; i<cll.length;i++){
          if(cll[i].ContinentName == "Africa"){
            countriesInAfrica[cll[i]["CountryName"]] = cll[i];
          }
        }
        callback();
    });
}

function drawInitialVisualization(){
  var ct = 0;
  noStroke();
  var years = Object.keys(conflictsPerYrPerCountry);

  var yr = 1989;
  drawConflictsPerCountry();
  //drawConflicts(yr,conflictsPerYrPerCountry[yr]);
  /*setInterval(function(){
    clear();
    ct++;
    if(ct == years.length){
      ct =0;
      clearInterval();
    }
    textSize("24");
    fill("#000000");
    drawConflicts(years[ct],conflictsPerYrPerCountry[years[ct]]);
  },500);
  */
}

function drawHistogram(){
  var numOfYrs = Object.keys(conflictsPerYrPerCountry).length;
  var w = Math.floor((windowWidth-40)/(numOfYrs-1)), ct=0, yrTrend = [], maxC = 0, lowC=1000;
  for(var year in conflictsPerYrPerCountry){
      var sumConflicts = 0;
      for(var country in conflictsPerYrPerCountry[year]){
        sumConflicts += parseInt(conflictsPerYrPerCountry[year][country]);
      }
      yrTrend.push(sumConflicts);
      if(sumConflicts>maxC){
        maxC = sumConflicts;
      }
      if(sumConflicts<lowC){
        lowC = sumConflicts;
      }
  }
  if(Math.round(maxC/lowC) >90){
    maxC = lowC*100;
  }
  stroke("#555555");
  strokeWeight(2);
  for(var i=0;i<(yrTrend.length-1);i++){
    if(yrTrend[i]>maxC){
      yrTrend[i] = maxC;
    }
    if(yrTrend[i+1] > maxC){
      yrTrend[i+1] = maxC;
    }
    var x1 = 30 + i*w;
    var y1 = map(yrTrend[i], 0, maxC, 200, 40);
    var x2 = 30 + (i+1)*w;
    var y2 = map(yrTrend[i+1], 0, maxC, 200, 40);
    stroke("#555555");
    line(x1,y1,x2,y2);
    if(selectedYr == (1952+i+1)){
      noStroke();
      fill("#f44336");
      var el = ellipse(x2,y2,15);
      el.
      textSize(16);
      text(selectedYr,x2+25,y2);
    }else{
      fill("#888888");
      noStroke();
      ellipse(x2,y2,7);
    }
  }
}

function drawCountries(){
  var ct=1;
  var numOfCountries = Object.keys(countriesInAfrica).length;
  var w = Math.floor((windowWidth-40)/numOfCountries);
  for(var country in countriesInAfrica){
    stroke("#ffffff");
    var x = ct*(w-10) + (ct-1)*10;
    line(x, windowHeight-40, x+w-10, windowHeight-40);
    ct++;
  }
}

function drawConflicts(yr,conflictInYr){
  var ct = 0, wBar = 40;
  selectedYr = parseInt(yr);
  var numOfCountries = Object.keys(conflictInYr).length;
  var wl = windowWidth-wBar*(numOfCountries) - 20*(numOfCountries);
  for(var country in conflictInYr){
    //var x = map(countriesInAfrica[country]["CapitalLongitude"],0,wBar,100,windowWidth-100);
    //var y = map(countriesInAfrica[country]["CapitalLatitude"],-90,90,height,0);
    fill("#f44336");
    var x = wl/2 + ct*wBar + (ct+1)*20;
    rect(x,300,wBar,15*conflictInYr[country]);
    textSize("12");
    fill("#000000");
    textAlign(CENTER,BOTTOM);
    text(country.trim(),x,270, wBar,30);
    ct++;
  }
}
function drawConflicts(yr,conflictInYr){
  var ct = 0, wBar = 40;
  selectedYr = parseInt(yr);
  var numOfCountries = Object.keys(conflictInYr).length;
  var wl = windowWidth-wBar*(numOfCountries) - 20*(numOfCountries);
  for(var country in conflictInYr){
    //var x = map(countriesInAfrica[country]["CapitalLongitude"],0,wBar,100,windowWidth-100);
    //var y = map(countriesInAfrica[country]["CapitalLatitude"],-90,90,height,0);
    fill("#f44336");
    var x = wl/2 + ct*wBar + (ct+1)*20;
    rect(x,300,wBar,15*conflictInYr[country]);
    textSize("12");
    fill("#000000");
    textAlign(CENTER,BOTTOM);
    text(country.trim(),x,270, wBar,30);
    ct++;
  }
}


function drawConflictsPerCountry() {

    var countries = Object.keys(conflictsPerYrPerCountry).length;
    var perCountryData = {};

    for(var conflictInYr in conflictsPerYrPerCountry){
      var yearConflicts = conflictsPerYrPerCountry[conflictInYr];
      for(var country in yearConflicts){
        if(!perCountryData[country]){
            perCountryData[country] = {};
        }
        perCountryData[country][conflictInYr] = yearConflicts[country];
      }
    }

    var cellHeightSmall = 2, cellHeightBig = 35;

    resizeCanvas(windowWidth, ((cellHeightBig+cellHeightSmall)*countries+100)/(1.4));

    var ctCountry = 0, cellHeight = cellHeightSmall, marginTop = 90, marginLeft = 20;
    //A minor adjustment of 0.3
    var cellWidth = Math.floor((windowWidth-(marginLeft*2))/(countries-1))+0.3;

    textSize("16");
    fill("#FFFFFF");
    stroke("#FFFFFF");
    line(20, marginTop-20, 20,marginTop);
    text(startingYear,24,marginTop-20,10,20);
    line(windowWidth-25, marginTop-20, windowWidth-25,marginTop);
    text(startingYear+countries-1,windowWidth-63,marginTop-20,10,20);
    line(windowWidth-25, marginTop-20, windowWidth-25,marginTop);
    var nextCountry = Math.floor(countries*.25);
    line(20+cellWidth*nextCountry,marginTop-20,20+cellWidth*nextCountry,marginTop);
    text(startingYear+nextCountry,20+cellWidth*nextCountry+4,marginTop-20,10,20);

    var nextCountry = Math.floor(countries*.5);
    line(20+cellWidth*nextCountry,marginTop-20,20+cellWidth*nextCountry,marginTop);
    text(startingYear+nextCountry,20+cellWidth*nextCountry+4,marginTop-20,10,20);

    var nextCountry = Math.floor(countries*.75);
    line(20+cellWidth*nextCountry,marginTop-20,20+cellWidth*nextCountry,marginTop);
    text(startingYear+nextCountry,20+cellWidth*nextCountry+4,marginTop-20,10,20);

    for(var country in perCountryData){
      for(var z=0;z<=countries;z++){
          var intensity = perCountryData[country][startingYear + z];
          noStroke();
          if(!intensity){
              noFill();
              rect(marginLeft+z*cellWidth, marginTop+cellHeight*ctCountry, cellWidth, cellHeight);
          }else{
              var colorPos = intensity/6 < 1 ? (intensity-1) : intensity/100 < 1 ? 5 : 6;
              fill(colors[colorPos]);
              rect(marginLeft+z*cellWidth, marginTop+cellHeight*ctCountry, cellWidth, cellHeight);
          }
      }
      ctCountry++;
    }

    var ctCountry = 0, cellHeight = cellHeightBig, marginTop = 90 + cellHeightSmall*(countries-1), marginLeft = 20, labelWidth = 80;
    var cellWidth = Math.floor((windowWidth-marginLeft*2-labelWidth)/(countries-1));

    for(var country in perCountryData){
      textStyle(BOLD);
      textSize("9");
      textAlign(LEFT,CENTER);
      fill("#ffffff");
      noStroke();

      text(country, marginLeft, marginTop+cellHeight*ctCountry,80,cellHeight);
      for(var z=0;z<=countries;z++){
          var intensity = perCountryData[country][startingYear + z];
          noStroke();
          var x = marginLeft+labelWidth+z*cellWidth;
          var y = marginTop+cellHeight*ctCountry;
          if(!intensity){
              noFill();
              rect(x,y, cellWidth, cellHeight);
          }else{
              var colorPos = intensity/6 < 1 ? (intensity-1) : Math.floor(intensity/100) < 1 ? 5 : 6;
              fill(colors[colorPos]);
              rect(x, y, cellWidth, cellHeight);
              pointsArray.push({
                "info" : "<div><b>"+(startingYear+z)+"</b></div><div>"+country + " - " + getFatalities(intensity)+"</div>",
                "x"  : x,
                "y" : y,
                "w" : cellWidth,
                "h" : cellHeight
              });
          }
      }
      stroke("#238377");
      line(marginLeft, marginTop+cellHeight*(ctCountry+1), windowWidth-marginLeft, marginTop+cellHeight*(ctCountry+1));
      ctCountry++;
    }

    noStroke();
    textStyle(NORMAL);
    fill("#ffffff");
    textSize("10");
    text("Conflict event in a country (Color : number of fatalities)",windowWidth-65-35*colors.length-300,30,300,15);
    for(z=0;z<colors.length;z++){
      fill(colors[colors.length-(z+1)]);
      noStroke();
      rect(windowWidth-65-45*z,30,45,15);
      var fatalities = colorFatalities[colors.length-(z+1)];
      fill("#ffffff");
      textSize("9");
      text(fatalities,windowWidth-65-45*z,20);
    }

    textStyle(BOLD);
    textSize("20");
    fill("#ffffff");
    text("SSA Conflict Events : 1952-2015, Event & Intensity",20,40);

}

function getFatalities(intensity){
  if(intensity ==1){
    intensity = "< 1k";
  }else if(intensity ==2){
    intensity = "1-2k";
  }
  else if(intensity ==3){
    intensity = "2-3k";
  }
  else if(intensity ==4){
    intensity = "3-4k";
  }else if(intensity ==5){
    intensity = "4-5k";
  }
  else if(intensity > 5 && intensity < 100){
    intensity = "above 5k";
  }
  else{
    intensity = "genocide";
  }
  return intensity;
}

function handleClick(){
    if($(".info").is(":visible")){
      $(".info").hide();
    }
    for(var i=0;i<pointsArray.length;i++){
      var point = pointsArray[i];
      if(mouseX > point.x && mouseX < (point.x + point.w) && mouseY > point.y && mouseY < (point.y + point.h)){
        fill("#cccccc");
        $(".info").show().css({
          "top" : mouseY,
          "left" : mouseX
        }).html("<span>"+point.info+"</span>");
      }
    }
}
