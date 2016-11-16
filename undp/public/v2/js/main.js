var mapObj;
var countryOfDyads = {} ;

var timePeriod = {
  "from" : 1989,
  "to" : 2014
};

var bgColor = "#f9f9f9"
var baseColor = "#4A4A4A";
var highlightColor = "#EF5050";
var secondHighlightColor = "#006e98"

var conflictTypes = [1,2,3], indicatorType = "unemp", changed = "indicator", countrySelected = ["Algeria","DZA"];

var  SSAConflict = (function(){
  var w = window.innerWidth*.6, h = window.innerHeight*.7, svg, dyadsCont, timeline, indi, countryDyadsCont, conflictCountries, impactDomain=[], impactDomainInitialValue;
  var yr1 = 1989, yr2=2015, lineTypes = ["0","2","8"], mainColor = "#00695c";
  
  var runQ = function(q,c,ind,type){
    //var basesearchurl = "http://localhost:9200/";
    var basesearchurl = "https://search-undp-nnvlmicmvsudjoqjuj574sqrty.us-west-2.es.amazonaws.com/";
    $.ajax({
      type: "POST",
      url: basesearchurl+(ind || "ucdp") + "/"+ (type || "event") + "/_search",
      data: JSON.stringify(q),
      success: function(data){
        c(data);
      },
      dataType: "json"
    });
  };

  var highlighCountry = function(cname,c){
      cname  = cname || countrySelected[0];
      c = c || countrySelected[1];
      $(".header .title .dynamic").text(cname);
      $(".user_selection .ct").text( $(".ehcc_"+c).length);
      $(".user_selection .co").text( cname);
      $(".user_selection .ev").text( $(".epc_"+c).length);

      d3.selectAll(".eventHomeCountry,.eventPoint")
        .style("stroke",baseColor)
        .style("stroke-width",1);

      d3.selectAll(".countryLeftBorder")
        .style("stroke",baseColor)
        .style("stroke-width",1);

      d3.selectAll(".ehcc_"+c+",.epc_"+c)
        .style("stroke",highlightColor)
        .style("stroke-width",3);

      d3.selectAll(".clb_"+c)
        .style("stroke",highlightColor)
        .style("stroke-width",3);

      var indiq = es_queries["indicator"][indicatorType];
      var q = indiq["q"]["country"];
      q["query"]["bool"]["must"][0]["terms"]["ccode"] = [c];
      $("#countryIndicator").remove();
      runQ(q,function(data){
          unempIndicator(data.hits.hits.map(function(d){
              return {
                "key" : d._source.yr,
                "value" : d._source.value
              }
            }),secondHighlightColor ,2, true,"countryIndicator");
      },indiq.index,indiq.type);
  };

  //EVENT BL 

  var highlightDyad = function(id) {
    var dy = countryOfDyads[id];
    $(".user_selection").html(dy.d_name + "(" +dy.country+ ")" + "<br>" + dy.conflicts +" conflict events" + "<br>" + dy.fatalities +" fatalities");


    var h =  $("#d_"+id).parent().parent().height();
    var pos = $("#d_"+id).position().top;
    if(pos > h){
      $("#dyads").animate({ scrollTop: (pos-h)+"px" });
    }else{
      $("#dyads").animate({ scrollTop: 0 });
    }
    d3.selectAll("[activated='yes']")
      .style("stroke-width",0.3)
      .style("stroke",baseColor)
      .attr("activated","no");
    d3.selectAll(".dcc")
      .style("display","none");

    d3.selectAll(".dc_"+id)
      .style("stroke-width",1)
      .style("stroke",highlightColor)
      .attr("activated","yes");
    d3.select("#dcc_"+id)
      .style("display","block");
    d3.selectAll(".ep_"+id)
      .style("stroke",highlightColor);
  }



  var drawMap = function(){
      var countries = [];
      if(!mapObj){
        var myCustomStyle = {
              fill: true,
              fillColor: baseColor,
              fillOpacity: 0.3,
              color : "rgba(255,255,255,1)",
              weight: 0.8
          }
        mapObj = L.map('mapp',{
            center : [10.4530702,20.035771],
            zoom : 3,
            minZoom : 3,
            dragging : true,
            touchZoom  : false,
            scrollWheelZoom : true,
            doubleClickZoom : false,
            boxZoom : false,
            zoomControl : false,
            attributionControl : false
        });
        L.geoJson(africa, {
            clickable: true,
            style: myCustomStyle,
            onEachFeature : function(d,l){
              var c = d.properties.iso_a3;
              var cname = d.properties.sovereignt;
              l.on("click",function(){
                highlighCountry(cname,c);
              });
              if(conflictCountries.indexOf(c)>-1){
                l.setStyle({fillOpacity: 0.7});  
              }
              
            }
        }).addTo(mapObj);

      }
      drawConnections();    
      
  }

  var drawConnections = function(){
    //The line SVG Path we draw
    var marginTop=0, marginRight=40;
    var lines  = [], he = (h-10)/Object.keys(countryOfDyads).length;
    var svgg = d3.select(".leaflet-zoom-animated");
    var markers = svgg.append("g")
                      .attr("id","markers");

    for(var d in countryOfDyads){
      var positions = countryOfDyads[d].positions;
      var countryCode = countryOfDyads[d].ccd;
      var seq = countryOfDyads[d].seq;
      var max = positions.length > 75 ? 75 : positions.length;
      for(var i=0;i<max;i++){
        var latlong = mapObj.latLngToLayerPoint(positions[i]);
        var marker = L.circleMarker(positions[i],{
          radius : 0.3,
          color : baseColor,
          className : "eventPoint epc_"+countryCode + " epd_"+d
        });

        mapObj.addLayer(marker);
      }
      for(var i=0;i<1;i++){
        var latlong = mapObj.latLngToLayerPoint(positions[i]);
        var marker = L.circleMarker(positions[i],{
          radius : 4, 
          color : baseColor,
          className : "eventHomeCountry ehcc_"+countryCode + " ehcd_"+d,
          d_id : d
        });
        marker.on("click",function(){
          alert("somthing");
        });
        mapObj.addLayer(marker);
        lines = [];
        lines.push({
          "x" : latlong.x,
          "y" : latlong.y
        });
        var x = $("#mapp").width()- 10 - (seq+1)*5;
        // x = x > latlong.x ? latlong.x : x;
        lines.push({
          "x" : x,
          "y" : latlong.y
        });
         lines.push({
            "x" : x,
            "y" : marginTop + he*seq
        });
        lines.push({
            "x" : $("#mapp").width(),
            "y" : marginTop + he*seq
        });
        
        var type = countryOfDyads[d].type;
        var lineFunction = d3.line()
                              .curve(d3.curveBasis)
                              .x(function(d) { return d.x; })
                              .y(function(d) { return d.y; })
      }
    }
  }


 


  var drawDyads = function(data,ct,newCountry,marginTop,ccd,eventTimeline){
    if(newCountry){
      //Its a new country
      countryDyadsCont = dyadsCont.append("g")
                   .attr("class","countryDyadsCont")
                   .attr("ccd", ccd);
    }
    dyadD = countryDyadsCont.append("g")
                   .attr("name", data[0]._source.d_name)
                   .attr("class","countryDyad")
                   .attr("id", "d_"+data[0]._source.d_id)
                   .attr("ccd", ccd);

    var marginLeft = 10, marginRight=0.03*window.innerWidth;
 
    var wi = w-marginLeft-marginRight;
    var he = 5;
    //var he = ($("#dyads").height()-marginTop - 10)/dyadsCt;
   // he = he > 30 ? 30 : (he < 10 ? 10 : he );

    var domain = (yr2-yr1+1)*365*24*60*60*1000;
    var x = d3.scaleLinear()
              .domain([0, domain])
              .range([marginLeft, wi]);
    var y = marginTop + (he)*ct;
    var type = data[0]._source.type_of_conflict;
    

    if(newCountry){
      // dyadD.append("text")
      //        .attr("x", marginLeft)
      //        .attr("y", y-he)
      //       .style("fill",baseColor)
      //       .style("font-size",he*2+"px")
      //       .text(country)
    }
    

    countryDyadsCont.append("line")
             .attr("x1", 5)
             .attr("x2", 5)
             .attr("y1", y-he/2)
             .attr("y2", y+he/2)
            .style("stroke",secondHighlightColor)
            .attr("class","countryLeftBorder clb_"+ccd)
            .style("stroke-width",0.2);
    //.style("stroke-dasharray",lineTypes[type-1])
    dyadD.append("line")
             .attr("x1", x(0))
             .attr("x2", w-marginRight)
             .attr("y1", y)
             .attr("y2", y)
            .style("stroke",secondHighlightColor)
            .attr("id", "cdt_"+data[0]._source.d_id)
            .attr("class","countryDyadType")
            .style("stroke-width",0.1);

    for(var i=0;i<data.length;i++){
        var event = data[i]._source;
        //Just assuming here, all the events of dyads happen in same country
        countryOfDyads[event.d_id] = countryOfDyads[event.d_id] || {"positions" : []};
        countryOfDyads[event.d_id]["type"] = event.type_of_conflict;
        countryOfDyads[event.d_id]["seq"] = ct;
        countryOfDyads[event.d_id]["positions"].push([event.latitude,event.longitude]);
        countryOfDyads[event.d_id]["country"] = (event.country);
        countryOfDyads[event.d_id]["ccd"] = (event.ccd);
        countryOfDyads[event.d_id]["d_name"] = (event.d_name);
        countryOfDyads[event.d_id]["conflicts"] = data.length;
        countryOfDyads[event.d_id]["fatalities"] = (countryOfDyads[event.d_id]["fatalities"] || 0) + event.best_est;
    }
    var daysToClub = Math.floor(eventTimeline.length/wi);
    var ctt = 0, value=0, covered=0, justCounting =0, justCountingTotal=0;
    while(ctt<eventTimeline.length){
        value = 0;
        for(var i=0;i<daysToClub;i++){
          value += eventTimeline[ctt];
          ctt++;
        }
        if(value){
          var x1 = marginLeft + covered;
          var x2 = x1+1;
          //var height = ((value > he ? he : value)/he)*he;
          var height = getHeight(value,he);
          dyadD.append("rect")
             .attr("x", x1)
             .attr("y", y-height)
             .attr("width", 1)
             .attr("height", height)
             .style("fill",getColor2(value))
             .attr("deaths", value);
          if(value<10000 && value > 3000){
            justCounting++;
          }
          justCountingTotal++;
        }
        covered++;
    }
  }
  function getHeight(value,he){
    if(value <= 10){
      return he;
    }
    else if(value > 10 && value <= 100){
      return he;
    }
    else if(value > 100 && value <= 500){
      return he;
    }
    else if(value > 500 && value <= 5000){
      return he;
    }
    else if(value>5000){
      return he*5;
    }
  }

  function getColor2(value){
    if(value <= 10){
      return "#F3BE8A";
    }
    else if(value > 10 && value <= 100){
      return "#E2825F";
    }
    else if(value > 100 && value <= 500){
      return "#C71F17";
    }
    else if(value > 500 && value <= 5000){
      return "#8A0D0A";
    }
    else if(value>5000){
      return "#8A0D0A";
    }
    /*
    if(value <= 1000){
        return "rgba(239, 80, 80, 1)";
      }else if(value> 1000 & value < 5000){
         return "rgba(0, 0, 0,1)";
      }else if(value >= 5000){
        return "rgba(0, 0, 0,0.5)";
      }
    */
  }


  var getConflictsDyad = function(dyads,cct,ct,totalCt,callback){

    var countryGrp, q = es_queries["dyad_conflicts"];
    console.log(dyads[cct].key + "-" + ct);
    q["query"]["bool"]["must"][0]["term"]["d_id"]["value"] = dyads[cct]["dyads"]["buckets"][ct].key;
    q["query"]["bool"]["must"][1]["term"]["ccd"]["value"] = dyads[cct].key;

    //Once i have sequence I find per year the list of countries
    runQ(q,function(data){
      var dyadData = data.hits.hits;
      var eventTimeline = [];
      for(var i=0;i<(timePeriod.to-timePeriod.from)*365;i++){
        eventTimeline[i] = 0;
      }
      for(var i=0;i<dyadData.length;i++){
        var event = dyadData[i]._source;
        var days = new Date(event.date_end)-new Date(event.date_start);
        days = days ? days / (1000*60*60*24) : 1;
        eventTimeline[(new Date(event.date_end)-new Date("1989-01-01"))/(1000*60*60*24)] += event.best_est/days;
      }
      
      drawDyads(dyadData,totalCt,(ct == 0 ? true : false), 20+20*cct,dyads[cct].key,eventTimeline);
      ct++;
      if(ct<dyads[cct]["dyads"]["buckets"].length){
        totalCt++;
        getConflictsDyad(dyads,cct,ct,totalCt,callback)  
      }else{
        cct++;
        if(cct<dyads.length){
          totalCt++;
          getConflictsDyad(dyads,cct,0,totalCt,callback)  
        }else{
          $(".dyad").on("click",function(){
              var id = $(this).attr("id").replace("d_","");
              highlightDyad(id);
          });
          callback();
        }
      }
      
    });
  };


  var drawTimeline = function(){

      var marginTop =20, marginRight=window.innerWidth*0.015, timeInterval = 5, marginLeft=30;

      var yrInterval = parseInt((timePeriod.to  - timePeriod.from)/timeInterval);

      var yrStart = timePeriod.from;

      var x = d3.scaleLinear()
              .domain([timePeriod.from, timePeriod.to])
              .range([marginLeft, w-marginRight-marginLeft]);

      while(true){
        timeline.append("text")
            .attr("x", x(yrStart))
            .attr("y",marginTop)
            .attr("text-anchor","middle")
            .attr("alignment-baseline","central")
            .style("fill",baseColor)
            .style("font-size","20px")
            .text(yrStart);
        if(yrStart == timePeriod.to){
          break;
        }
        else if(yrStart + yrInterval> timePeriod.to){
          yrStart = timePeriod;
        }else{
          yrStart += yrInterval;
        }
      }
  };

  var unempIndicator = function(dataUnem,color,stroke, markers, id){
    
    var maxUnem = 0, minUnem = 100000000, marginRight=0.03*window.innerWidth;

    for(var i=0;i<dataUnem.length;i++){
      if(dataUnem[i].value > maxUnem){
        maxUnem = dataUnem[i].value;
      }
      if(dataUnem[i].value < minUnem){
        minUnem = dataUnem[i].value;
      }
    }
    //Iam going to set the impact domain once while drawing  the SSA values
    if(!impactDomain.length){
      impactDomain[0] = Math.ceil((maxUnem-dataUnem[0].value)*2);
      impactDomain[1] = Math.ceil((minUnem-dataUnem[0].value)*2);
      impactDomainInitialValue = dataUnem[0].value;
    }
    var lines = [];
    var x = d3.scaleLinear()
              .domain([1989, 2014])
              .range([0, w-marginRight]);
    var y = d3.scaleLinear()
              .domain([impactDomain[0], impactDomain[1]])
              .range([0, window.innerHeight*.15]);
    
    var initialValue = dataUnem[0].value;

    var interval = parseInt((impactDomain[0] - impactDomain[1])/3)+1;
    for(var i=impactDomain[1];i<=impactDomain[0];){
      debugger;
      indi.append("text")
        .attr("x", 10+x(1989))
        .attr("y", y(i)+10)
        .attr("text-anchor","middle")
        .attr("alignment-baseline","central")
        .style("fill",baseColor)
        .style("font-size","12px")
        .text(parseInt(impactDomainInitialValue + i));  
      i = i + interval;
    }
    indi.append("line")
             .attr("x1", x(1989))
             .attr("x2", x(1989))
             .attr("y1", y(impactDomain[1])+10)
             .attr("y2", y(impactDomain[0])+10)
            .style("stroke",baseColor)
            .style("stroke-width",1);
    
    indi.append("circle")
          .attr("cx", x(1989)+2)
          .attr("cy", y(initialValue - impactDomainInitialValue))
          .attr("r", 2 )
          .attr("fill",color)
    
    lines.push({
          "x" : x(1989),
          "y" : y(initialValue - impactDomainInitialValue)
    });
    for(var i=1;i<dataUnem.length;i++){
      var xp = x(dataUnem[i].key);
      var diff = dataUnem[i].value-impactDomainInitialValue ;
      if(diff > impactDomain[0]){
        console.log("ouch");
        diff = impactDomain[0];
      }else if(diff < impactDomain[1]){
        diff = impactDomain[1];
        console.log("ouch");
      }
      var yp =  y(diff);
      lines.push({
          "x" : xp,
          "y" : yp
      });
      // indi.append("circle")
      //     .attr("cx", xp)
      //     .attr("cy", yp)
      //     .attr("r", 2 )
      //     .attr("fill",color)
    }

    var lineFunction = d3.line()
                          .curve(d3.curveBasis)
                          .x(function(d) { return d.x; })
                          .y(function(d) { return d.y; })

    var lineGraph = indi.append("path")
                              .attr("d", lineFunction(lines))
                              .attr("stroke", color )
                              .attr("fill", "none")
                              .attr("id",id)
                              .style("stroke-width",stroke);
  };

var filterEvents = function(){

     $(".header .sub").on("click",function(){
        if(changed == "indicator"){
          SSAConflict.clearIndicator();
          SSAConflict.renderIndicators();
        }else if(!$(this).hasClass("disabled")){
          SSAConflict.clear();
          SSAConflict.init();  
          $(this).addClass("disabled");
        }
     });

     $(".filter").on("click",function(){
        $(this).find(".hidden").toggle();
     });
     $(".filter.conflicts .hidden .label").on("click",function(){   
         var el = $(this);
         if(!el.hasClass("active")){
            $(".filter .hidden .label.active").removeClass("active");
            el.addClass("active");
            el.parent().parent().find(".selected").text(el.data("text"));
            var val = parseInt(el.data("val"));
            if(val == 0){
              conflictTypes = [1,2,3];
            }else{
              conflictTypes = [val];
            }
         }
         $(".header .sub").removeClass('disabled');
         el.parent().find(".hidden").hide();
     });  

     $(".filter.indicators .hidden .label").on("click",function(){   
         changed = "indicator";
         var el = $(this);
         if(!el.hasClass("active")){
            $(".filter .hidden .label.active").removeClass("active");
            el.addClass("active");
            el.parent().parent().find(".selected").text(el.data("text"));
            indicatorType = el.data("val");
            impactDomain = [];
         }
         $(".header .sub").removeClass('disabled');
         el.parent().find(".hidden").hide();
     });  
  };

  return {

    filterEvents : function(){
      filterEvents();
    },

    drawGeoMap : function(){
      drawMap();
    },
    renderDyadConflicts : function(doneCallback){
      //With this query I get the list of countries in order of most intense
      // conflicts over all the year
      var q = JSON.parse(JSON.stringify(es_queries["sequence_dyads"]));
      q["query"]["bool"]["must"][0]["range"]["year"]["gte"] = timePeriod.from;
      q["query"]["bool"]["must"][0]["range"]["year"]["lte"] = timePeriod.to;
      q["query"]["bool"]["must"][1]["terms"]["type_of_conflict"] = conflictTypes;

      runQ(q,function(aggs){
        var data = aggs.aggregations.country_dyads.buckets, seq=[], dyads=[];
        for(var i=0;i<data.length;i++){
          if(data[i].dyads.buckets.length) 
            dyads.push(data[i]);
        }
        countryOfDyads = {};
        conflictCountries = dyads.map(function(o){
          if(o.dyads.buckets.length) 
            return o.key;
        });
        getConflictsDyad(dyads,0,0,0,function(){
          doneCallback();
        });
      })
    },


    drawTimeline : function(){
      drawTimeline();
    },
    setup : function(width){
      var ww = width || w;
      dyadsCont = d3.select("#dyads")
                    .append("svg")
                    .attr("width", ww)
                    .attr("height", $("#dyads").height()*5)
                    .attr("id","dyadsCont");
      // dyadsCont = svg.append("g").attr("id","dyadsCont");

      timeline = d3.select(".timeline .container").append("svg")
                       .attr("id","timeline")
                       .attr("width", ww)
                       .attr("height", window.innerHeight*.07);

      indi = d3.select(".indicator").append("svg")
                       .attr("id","indicator")
                       .attr("width", ww)
                       .attr("height", window.innerHeight*.19);
    },
    clear : function(){
        $("#dyadsCont").empty();
        $("#timeline").empty();
        $("#indicator").empty();
        $("#mapp #markers").empty();
        $(".eventPoint,.eventHomeCountry").remove();
    },
    clearIndicator : function(){
      $("#indicator").empty();
    },
    resize : function(wi){
      w = wi;
      dyadsCont.attr("width",wi);
      timeline.attr("width",wi);
      indi.attr("width",wi);
    },
    init : function(yr1,yr2){
        SSAConflict.renderDyadConflicts(function(){
          SSAConflict.drawTimeline();
          SSAConflict.drawGeoMap();
          SSAConflict.renderIndicators();
          highlighCountry();
        });
    },

    renderIndicators : function(){
        var indiq = es_queries["indicator"][indicatorType];
        var q = indiq["q"]["ssa"];
        runQ(q,function(data){

            unempIndicator(data.aggregations.by_year.buckets.map(function(d){
              return {
                "key" : d.key,
                "value" : d.avg_v.value
              }
            }),baseColor,1);
        },indiq.index,indiq.type);
    }

  }

})();


SSAConflict.setup();
SSAConflict.init();
SSAConflict.filterEvents();

