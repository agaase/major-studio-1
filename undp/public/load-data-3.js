var countriesInAfrica = {}, conflictsPerYrPerCountry = {}, bgImg, selectedYr, startingYear = 1952 ;

var colors = ["#FFF176","#FFB74D","#E57373","#F44336","#B71C1C","#69020F","#000000"];
function setup() {
  createCanvas(windowWidth,windowHeight);
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

    var cellHeightSmall = 2, cellHeightBig = 25;

    resizeCanvas(windowWidth, (cellHeightBig+cellHeightSmall)*countries+100);

    textStyle(BOLD);
    textSize("24");
    fill("#ffffff");
    text("SSA Conflicts (Over time)",20,40);



    var ctCountry = 0, cellHeight = cellHeightSmall, marginTop = 90, marginLeft = 20, labelWidth = 10;
    var cellWidth = Math.floor((windowWidth-(marginLeft*2))/(countries-1));

    textSize("16");
    text(startingYear,20,marginTop-20,10,20);
    text(startingYear+countries-1,windowWidth-80,marginTop-20,10,20);

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
    var cellWidth = Math.floor((windowWidth-marginLeft*2-labelWidth)/countries);


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
          if(!intensity){
              noFill();
              rect(marginLeft+labelWidth+z*cellWidth, marginTop+cellHeight*ctCountry, cellWidth, cellHeight);
          }else{
              var colorPos = intensity/6 < 1 ? (intensity-1) : intensity/100 < 1 ? 5 : 6;

              fill(colors[colorPos]);
              rect(marginLeft+labelWidth+z*cellWidth, marginTop+cellHeight*ctCountry, cellWidth, cellHeight);
          }
      }
      stroke("#cccccc");
      line(marginLeft, marginTop+cellHeight*(ctCountry+1), windowWidth-marginLeft, marginTop+cellHeight*(ctCountry+1));
      ctCountry++;
    }
}
