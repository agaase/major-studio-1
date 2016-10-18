var fs = require('fs');
var cheerio = require('cheerio');

var monthAndWords = {};
var months = ["january","february","march","april","may","june","july","august","september","october","november","december"];

var files = ["Africa_News-1990.html","Africa_News-1991.html","Africa_News-1993.html","Africa_News-1992.html","Africa_News-1994.html","Africa_News-1995-1.html","Africa_News-1995-2.html","Africa_News-1995-3.html","Africa_News-1995-4.html","Africa_News-1996-1.html","Africa_News-1996-2.html","Africa_News-1996-3.html","Africa_News-1996-4.html","Africa_News-1996-5.html","Africa_News-1996-6.html","Africa_News-1996-8.html","Africa_News-1996-9.html","Africa_News-1996-10.html","Africa_News-1996-11.html","Africa_News-1997-1.html","Africa_News-1997-2.html","Africa_News-1997-3.html","Africa_News-1997-4.html","Africa_News-1997-5.html","Africa_News-1997-6.html"];

for(var f=0;f<files.length;f++){
  var data = fs.readFileSync('public/data/reference/qualitative/'+files[f])
  //console.log(data);
  var $ = cheerio.load(data);
  var ct = 0;
  var elements = $('a[name="DOC_ID_0_'+ct+'"]');
  while(elements.length){
    elements  =  elements.prevUntil("a",".c5,.c3");
    var month="", year="", words=[];
    for(var i=0;i<elements.length;i++){
      var el = $(elements[i]);
      var temp1 =  $(".c6 .c7",el).html();
      var temp2 = $(".c1 .c2",el).html();
      var temp3 = $(".c1 .c4",el).html();
      if(temp1 && !words.length){
        words = temp1.toLowerCase().split(" ");
      }
      if(temp2 && temp2.indexOf("Copyright") == -1 && !year){
        temp2  = temp2.split("/");
        temp2 = temp2[temp2.length-1];
        temp2 = temp2.split(",");
        if(temp2.length>1){
          year = temp2[1].trim();
        }
      }
      if(temp3 && !month){
        month = months.indexOf(temp3.toLowerCase());
      }
      //console.log(el.html());
    }
    console.log(month + "-" + year + "-" + words);
    if(month && year && words){
      if(!monthAndWords[year])
        monthAndWords[year] = {};
      if(!monthAndWords[year][month])
          monthAndWords[year][month] = "";
      monthAndWords[year][month] += ";" + words.join("$$");
    }
    ct++;
    elements = $('a[name="DOC_ID_0_'+ct+'"]');
  }
}


fs.writeFileSync('public/data/reference/qualitative/words.json',JSON.stringify(monthAndWords));

//console.log(elements.length);
