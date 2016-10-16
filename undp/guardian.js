var request = require('request');
var fs = require('fs');

var guardianRecords = [];
//the guardian UK
var key = "0b38f2a5-934d-4988-833f-9f273b3e8faa";
var endpoint = "http://content.guardianapis.com/search?section=world&from-date=1960-01-01&to-date=2016-12-31&page-size=200&q=africa";

function guardianRequest(page){
  request(endpoint + "&order-by=oldest&api-key="+key + "&page="+page , function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      var records = data.response.results;
      var pages = data.response.pages;
      guardianRecords = guardianRecords.concat(records);
      console.log(page + " of " + pages + " done");
      page++;
      if(page <= pages ){
          guardianRequest(page);
      }else{
        fs.writeFileSync('dumps/news/guardian.json', JSON.stringify(guardianRecords));
      }
    }
    else {
      console.error('request failed; exiting');
      fs.writeFileSync('dumps/news/guardian.json', JSON.stringify(guardianRecords));
    }
  });
}
guardianRequest(1);
