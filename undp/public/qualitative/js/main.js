var Renderer = (function(){

  var years = { "2010-2016" : [ { "word" : "test1", "score" : 10}, { "word" : "test2", "score" : 8},{ "word" : "test3", "score" : 6}, { "word" : "test2", "score" : 5},{ "word" : "test3", "score" : 4},{ "word" : "test1", "score" : 10}, { "word" : "test2", "score" : 8},{ "word" : "test3", "score" : 6}, { "word" : "test2", "score" : 5},{ "word" : "test3", "score" : 4},{ "word" : "test1", "score" : 10}, { "word" : "test2", "score" : 8},{ "word" : "test3", "score" : 6}, { "word" : "test2", "score" : 5},{ "word" : "test3", "score" : 4},{ "word" : "test1", "score" : 10}, { "word" : "test2", "score" : 8},{ "word" : "test3", "score" : 6}, { "word" : "test2", "score" : 5},{ "word" : "test3", "score" : 4}] } ;

  var drawYearData = function(yr,words){
    //The outer container
    var yrDataCnt = d3.select(".outerContainer").append("div").attr("class","yearData");

    //Adding year label
    yrDataCnt.append("div").attr("class","yrLabel").html("<span>"+yr+"</span>");

    //Adding words



    for(var i=0;i<words.length;i++){
      var opacity = 1 - i*0.05;
      yrDataCnt.append("div")
               .attr("class","word")
               .style("opacity",opacity)
               .html("<span>"+words[i].word+"</span>");
    }
  }

  return {

    drawYears : function(){
      for(var yr in years){
        drawYearData(yr,years[yr]);
      }
      drawYearData("2010-2016",years["2010-2016"]);
      drawYearData("2010-2016",years["2010-2016"]);
      drawYearData("2010-2016",years["2010-2016"]);
      drawYearData("2010-2016",years["2010-2016"]);
      drawYearData("2010-2016",years["2010-2016"]);
      drawYearData("2010-2016",years["2010-2016"]);
      drawYearData("2010-2016",years["2010-2016"]);
      drawYearData("2010-2016",years["2010-2016"]);
      drawYearData("2010-2016",years["2010-2016"]);
    }

  }



})();

Renderer.drawYears();
