var canvas, mapp, mags=[], quakes=[];

function setup(){
  canvas = createCanvas(windowWidth,windowHeight);
  canvas.parent("map");
  initLeaflet();
  loadStrings("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv", parseSourceData);
  slider = createSlider(0,10,1);
  slider.position(width/2-50,25);
  slider.changed(updateQuakes);
}

function draw(){
  // for(var i=0;i<data.length;i++){
  //   quakes[i].setRadius(mags[i]*4);
  // }
}

function parseSourceData(data){
  for(var i=1;i<data.length;i++){
    var row = split(data[i],",");
    mags[i] = row[4];
    var place = row[13];
    quakes[i] = L.circleMarker([row[1],row[2]],{
      stroke : true,
      weight: 1,
      opacity: 0.3,
      fillOpacity: 0.8,
      fillColor : "#000"
    });
    quakes[i].setRadius(row[4]*2);
    quakes[i]
            .addTo(mapp).setRadius(mags[i])
            .bindPopup('<b>' + row[4] + '<b> magnitude ' + place);
  }
}

function updateQuakes() {
    for (var i = 1; i < quakes.length; i++) {
        // check if lider value excees individual magnitude
        if (mags[i] > slider.value())
            quakes[i].setRadius(mags[i]);
        else
            quakes[i].setRadius(0);
    }
}

function initLeaflet(){
  L.mapbox.accessToken = 'pk.eyJ1IjoiYWdhYXNlIiwiYSI6ImNpdWlua3BhOTAwMzgydHBja3V2aWM4c28ifQ.YPXpNNHUsTaElJTlwPj74Q';
  //mapp = L.mapbox.map("map","mapbox.light").setView([-3.599602,-20.5894476],4);
  mapp = L.mapbox.map("map","mapbox.light",{
    center: [2.5022496,12.9200712],
    zoom: 3
  });

  function onMapClick(e){

  }
  mapp.on("click",onMapClick);
}
