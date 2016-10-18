var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');

/**
@function
This is a utility function to parse the web.
Right now it only downloads the website pages for a specific alcohol meeting group
**/
var WebParser = (function(){

  /**
    @function
    Generic function to read urls recursively. As of now it assumes that
    the number is going to be padded with 0.
  **/
  var readUrl = function(url,file,callback){
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if(file){
                fs.writeFileSync('dumps/'+file, body);
            }
            callback(body);
        }
        else {
          console.error('request failed; exiting');
          callback(null);
        }
      });
  };
  return {
    scrapeUrl : readUrl
  }
})();

// create a model using the name of the DynamoDB table and a schema
//module.exports = WebParser;

var url = "http://allafrica.com/search/index.html?search-submit=Search&search_string=development&page=1";

var url2 = "http://content.guardianapis.com/search?section=world&from-date=1970-01-01&to-date=2016-12-31&page=1&page-size=200&q=africa&api-key=test";
WebParser.scrapeUrl(url2,null,function(data){
  //console.log(data);
  //var $ = cheerio.load(data);
  /*$(".search-results li").each(function(i,liel){
    var headline = $(".headline",liel).html();
    console.log(headline);
  });
  */
  console.log(JSON.parse(data).response.results.length);
})
