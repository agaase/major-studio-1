var rs;

var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=";


var searchArticles = function(q){
  var apiUrl = url + q + "&44a2350527774fbfa9e72130bcb90569";
  loadJSON(apiUrl, function(data){
    var docs = data.response.docs;
    for(var i=0;i<docs.length;i++){
      rita(docs[i].headline.main);
    }
  });
}

function keyPressed(){
  if(keyCode == ENTER){
    searchArticles(inputValue);
  }
}


var inputValue;
function setup(){
  noCanvas();
  var inp = createInput('');
  inp.input(inputVal);
}
function inputVal(){
  inputValue = this.value();
}

function rita(sentence){
  var rs = RiString(sentence.toLowerCase());
  var words = rs.words();
  var pos = rs.pos();
  console.log(pos);
  var analysed = "";
  for(var i=0;i<words.length;i++){
    if(pos[i].indexOf(("vb"))>-1){
      analysed +=  "&nbsp;<span class='noun'>"+words[i]+"</span>";
    }else{
        analysed += "&nbsp;" + words[i];
    }

  }
  wordSpan = createDiv(analysed);
}
