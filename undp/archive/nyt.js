var request = require('request');
var fs = require('fs');
/*
//the guardian UK
request("http://content.guardianapis.com/search?section=world&from-date=1970-01-01&to-date=2016-12-31&page=1&page-size=200&q=africa&api-key=test", function (error, response, body) {
  if (!error && response.statusCode == 200) {
      callback(body);
  }
  else {
    console.error('request failed; exiting');
    callback(null);
  }
});
*/

//NY TIMES

var nytData = [];
function getNYData(page){
  request.get({
    url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
    qs: {
      'api-key': "44a2350527774fbfa9e72130bcb90569",
      'q': "africa",
      'begin_date': "19750101",
      'end_date': "20161231",
      'sort': "oldest",
      'page': page
    },
  }, function(err, response, body) {
    try{
      body = JSON.parse(body);
      nytData = nytData.concat(body.response.docs);

      var pages = Math.ceil(body.response.meta.hits/10);
      console.log(page + " of " + pages + " done");
      page++;
      if(page<pages){
        setTimeout(function(){
            getNYData(page);
        },1000);
      }else{
        fs.writeFileSync('dumps/news/nyt.json', JSON.stringify(nytData));
      }
    }catch(err){
      //Pages  - 0
      //fs.writeFileSync('dumps/news/nyt.json', JSON.stringify(nytData));
      setTimeout(function(){
          getNYData(page);
      },3000);
    }
  });
}

getNYData(100);


//BBC - https://developer.bbc.co.uk/


// zeit online - http://developer.zeit.de/explorer/
// key - 5d4e10549238193b951e496b1b29f6e26df4cd185578e3bfbc69




//Reuters - https://customers.reuters.com/developer/apis_tech.aspx
