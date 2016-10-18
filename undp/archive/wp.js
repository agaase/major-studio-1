var request = require('request');
var fs = require('fs');

var guardianRecords = [];
//the guardian UK
var endpoint = "https://pqasb.pqarchiver.com/washingtonpost/results.html?st=basic&uid=&MAC=50a23aa1f3f5c6104e90e36051420d61&QryTxt=africa&&sortby=CHRON&start=0";

function guardianRequest(page){
  request(endpoint , function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //var data = JSON.parse(body);
      console.log(body);
      /*var records = data.response.results;
      var pages = data.response.pages;
      guardianRecords = guardianRecords.concat(records);
      console.log(page + " of " + pages + " done");
      page++;
      if(page <= pages ){
          guardianRequest(page);
      }else{
        fs.writeFileSync('dumps/news/guardian.json', JSON.stringify(guardianRecords));
      }
      */
    }
    else {
      console.log(error);
      //fs.writeFileSync('dumps/news/guardian.json', JSON.stringify(guardianRecords));
    }
  });
}
guardianRequest(1);
