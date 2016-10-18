var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var S = require('string');
var WP = require('wordpos');
var wordCount = {};
var subpageError = false;
var folders = ["ct","guardian","lat","wp","wsj"];


var uselessWords = ["for","and","the","in","of","as","a","on","its","an","or","to","&","new","can","some"];

var start =1960;
var yrKey = "1960-1969";
wordCount[yrKey]={};

function cleanWord(word){
  var invalid = true;
  if(S(word).isAlpha()){
    WP.getPOS(word,function(data){
        for(var k in data){
          if(data[k].length){
              console.log(word + " ---" +k);
              invalid = false;
              break;
          }
        }
        if(invalid){
          console.log(word + " --- ignore");
        }
    });
  }else{
    console.log("Invalid - "+word);
  }
};

function guardianRequest(yr,subpage){
    try{
        console.log("reading "+yr + " -- " +subpage);
        var file = fs.readFileSync("./dumps/scholar/"+yr+"_"+subpage+".mht");
        subpageError=false;
        file = file.toString();
        file = file.replace(/3D/g,"");
        var $ = cheerio.load(file);
        if((yr - start) == 10){
          yrKey = yr+"-"+(yr+9);
          wordCount[yrKey]={};
          start = yr;
        }
        $("#gs_bdy .gs_r").each(function(i,row){
          var headline = $("h3 a",row).html();
          headline = headline ? headline.replace(/<(.)*>/g,"").replace(/=/g,"").replace(/[\n\r]/g,"") : "";
          var words = headline.toLowerCase().split(" ");
          for(var i=0;i<words.length;i++){
            var word = words[i];
            if(word){
              if(wordCount[yrKey][word]){
                  wordCount[yrKey][word] = wordCount[yrKey][word] +1;
              }else{
                  wordCount[yrKey][word] = 1;
              }
            }
          }
        });
        subpage++;
        guardianRequest(yr,subpage);
      }
      catch(err){
        if(!subpageError){
            yr++;
            subpageError=true;
            guardianRequest(yr,1);
        }
      }
  }


guardianRequest(1960,1);
var $ = cheerio.load("<html><body></body></html>");

for(var key in wordCount){
    $("body").append("<div>"+key+"</div>");
    for(var word in wordCount[key]){
        if(wordCount[key][word]>5 && uselessWords.indexOf(word)==-1 && word.length>1){
            $("body").append("<div>"+word+"--"+wordCount[key][word]+"</div>");
        }

    }
    $("body").append("<br><br><br>");
}
fs.writeFileSync("./dumps/scholar/report.html",$.html());


console.log(JSON.stringify(wordCount));
