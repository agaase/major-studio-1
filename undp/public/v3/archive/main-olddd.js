var mapObj;
var countryOfDyads = {};

var dontShowUncertainty = dontShowUncertainty || false;

var timePeriod = {
  "from" : 1989,
  "to" : 2014
};
var estimate = 1;
var indicatorPercentile = [80,0];

var selectionColor = "#000000";
var bgColor = "#f9f9f9"
var baseColor = "#4A4A4A";
var baseColorLight = "#bbbbbb";
var highlightColor = "#EF5050";
var secondHighlightColor = "#006e98";
var healthColor = "#4c9f38";
var genocideColor = "#4C0901";
var highDeathColor  = "#8C0213";
var eventColorIndividual = "#FFE8C8";


var countryCodes = {
        "Algeria" : "DZA",
        "Somalia" : "SOM",
        "South Africa" : "ZAF",
        "Democratic Republic of the Congo" : "COD",
        "Sudan" : "SDN",
        "Nigeria" : "NGA",
        "Angola" : "AGO",
        "Uganda" : "UGA",
        "Ethiopia" : "ETH",
        "Sierra Leone" : "SLE",
        "Burundi" : "BDI",
        "Central African Republic" : "CAF",
        "Kenya" : "KEN",
        "Rwanda" : "RWA",
        "Liberia" : "LBR",
        "Libya" : "LBY",
        "South Sudan" : "SSD",
        "Chad" : "TCD",
        "Mali" : "MLI",
        "Senegal" : "SEN",
        "Mozambique" : "MOZ",
        "Cote d'Ivoire" : "CIV",
        "Congo" : "COG",
        "Cameroon" : "CMR",
        "Niger" : "NER",
        "Togo" : "TGO",
        "Guinea" : "GIN",
        "Equatorial Guinea" : "GNQ",
        "Zimbabwe" : "ZWE",
        "Djibouti" : "DJI",
        "Eritrea" : "ERI",
        "Madagascar" : "MDG",
        "Ghana" : "GHA",
        "Mauritania" : "MRT",
        "Guinea-Bissau" : "GNB",
        "Namibia" : "NAM",
        "Tanzania" : "TZA",
        "Zambia" : "ZMB",
        "Morocco" : "MAR",
        "Comoros" : "COM",
        "Lesotho" : "LSO",
        "Swaziland" : "SWZ",
        "Tunisia" : "TUN",
        "Botswana" : "BWA",
        "Benin" : "BEN",
        "Burkina Faso" : "BFA",
        "Cape Verde" : "CPV",
        "Egypt" : "EGY",
        "The Gambia" : "GMB",
        "Malawi" : "MWI",
        "Mauritius" : "MUS",
        "Sao Tome and Principe" : "STP",
        "Seychelles" : "SYC",
        "Gabon" : "GAB"
 };



var helpText = {
  "cr" : "Total enrollment in primary education, regardless of age, expressed as a percentage of the population of official primary education age.<br> ",
  "unemp" : "Unemployment, total (% of total labor force) (modeled ILO estimate)",
  "ct1" : "Fighting either between two states, or between a state and a rebel group that challenges it",
  "ct2" : "Conflicts in which none of the warring parties is a state",
  "ct3" : "The use of armed force by the government of a state or by a formally organized group against civilians which results in at least 25 deaths in a year",
  "i1" : "Countries in Africa have gone through a number of conflicts ever since their independence from colonial rule. Here we try to analyse those conflicts and the resulting deaths.<br><br> Conflicts result because of a disagreement between two groups either of which can be government or not. Violence due to conflicts not only results in deaths and destruction of property but a greater collateral damage leading to a complete breakdown of society.",
  "i2" : "If a country has a high GDP it doesn't necessarily mean its good for the people of the country. Inequality is very important while measuring the growth of a country.<br><br> There are a number of reasons which affect inequality like the GDP in a country, employment, health, education level etc. What we try to analyse here is the impact of violence due conflicts on some of these indicators which may give a clue about the reasons of inequality",
  "conflicts" : "What you see here is number of deaths or casualties caused by conflicts in a single year over time. That is what the height of the bar denotes. You can click on each bar to see the number of conflicts and the actual deaths.",
  "legend" : "HOW GOOD IS THIS DATA?<br>There is some amount of assumption taken while recording these events and hence an error is always possible. The bars show a high estimation as well as a low estimation level for the number of deaths.<br><br> The HIGH ESTIMATION takes highly clear events(sufficient detailed informationp present) as well as low clear events(sufficient detailed information NOT present) and the highest possible number of deaths possible.<br> The BEST ESTIMATION only takes highly clear events and best possible number of deaths.",
  "dataQuality" : "HOW GOOD IS THIS DATA?<br>There is some amount of assumption taken while recording these events and hence an error is always possible.<br><br> There are highly clear events(sufficient detailed information present) and low clear events (sufficient detailed information NOT present). <br>Also with each event there is a highest possible number of deaths and best possible number of deaths. The chart here takes the highest possible number of deaths.",
  "gdp" : "The total GDP of the country in US$",
  "ineq" : "Inequality is measured using GINI coeffecient and represents the income distribution of a nation's residents. The value lies between 0 and 100 where 100 denotes maximum inequality and 0 as NO inequality.",
  "health" : ""
}

var conflictTypes = [1,2,3], indicator = "Primary Enrollment", changed, countrySelected = ["Sudan","SDN"];
var device = {
  isMobile : window.matchMedia("(max-width: 480px)").matches
};

var  SSAConflict = (function(){
  var w = $(".right").width(), h = window.innerHeight*.7, svg, dyadsCont, eventTimeline, timeline, indi, countryDyadsCont, conflictCountries;
  var lineTypes = ["0","2","8"], mainColor = "#00695c";
  

  var runQ = function(q,c,ind,type){
    var basesearchurl = "http://localhost:9200/";
    // var basesearchurl = "http://35.161.122.132:9200/";
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
      $("#eventTimeline").hide().empty();
      $("#dyadsCont").show();
      $("#dyads .btn").removeClass("active");
      $("#dyads .yrTotal").addClass("active");
      
      cname  = cname || countrySelected[0];
      c = c || countrySelected[1];
      countrySelected[0] = cname;
      countrySelected[1] = c;
      SSAConflict.clear();
      SSAConflict.init();  
      $(".user_selection .label .selected").text(cname);

      $(".eventSelectedCountry").remove();
      d3.selectAll(".countryGeo")
      	.style("stroke-width",0.5)
      	.style("stroke",baseColor);

      d3.select(".country_"+c)
      	.style("stroke-width",1)
      	.style("stroke",selectionColor)
        .style("stroke-opacity",1);
  };


  var allEventTimeline = function(){
    var q = es_queries["all_conflicts_of_a_country"];
    q["query"]["bool"]["must"][0]["term"]["ccd"]["value"] = countrySelected[1];
    runQ(q,function(d){
      var events = d.hits.hits.map(function(d){
        return d._source;
      });
      var conflicts = {};
      for(var i=0;i<events.length;i++){
        var ev  =events[i];
        conflicts[ev.type_of_conflict] = conflicts[ev.type_of_conflict] || [];
        conflicts[ev.type_of_conflict].push(ev);
      }
      $("#dyadsCont").hide();
      $("#eventTimeline").show();
      var ht = parseInt(dyadsCont.attr("height"))/3, marginLeft=w*.05;
      var x = d3.scaleLinear()
                .domain([timePeriod.from, timePeriod.to+1])
                .range([marginLeft, w]);
      var ct=0;
      for(var conflictType in conflicts){
        var container = eventTimeline.append("g");
        var events = conflicts[conflictType];
        events = events.sort(function(a,b){
          return new Date(a.date_start) - new Date(b.date_start);
        });
        if(events.length > 0){
          for(var i=0;i<events.length;i++){
            var ev = events[i];
            var marker = L.circleMarker([ev.latitude,ev.longitude],{
              radius : 1, 
              color : baseColor,
              className : "eventSelectedCountry",
            });
            marker.bindPopup(ev.d_name + "<br>" + ev.country);
            mapObj.addLayer(marker);
            var xpos = x(timePeriod.from+((new Date(ev.date_start) - new Date(""+timePeriod.from))/(1000*60*60*24*365)));
            var scale = chroma.scale([bgColor,highlightColor]);
            var margin = ht/4;
            container.append("line")
                     .attr("x1",xpos)
                     .attr("y1",ct*ht+ht/4+(.75*ht-.75*ht*((ev.high_est>100 ? 100 : ev.high_est)/100)))
                     .attr("x2",xpos)
                     .attr("y2",ct*ht+ht)
                     .style("stroke",highlightColor);
          } 
        }
        ct++;
      }
    });
  };


  //This is where the skeleton is drawn with the conflict intensity.
  var drawMapSkeleton = function(){

    var colors = {
      "1": "#ffffff",
      "1000" : "#FFE8C8",
      "3000" : "#FFB78C",
      "10000" : "#ff5252",
      "50000" : "#f44336",
      "200000" : "#8C0213"
    };
    var q = es_queries["conflict_country"];
    q["query"]["bool"]["must"][0]["terms"]["clarity"] = estimate == 1 ? [1,2] : [1];
    q["aggs"]["country_inq"]["aggs"]["sum_v"]["sum"]["field"] = estimate == 1 ? "high_est" : "best_est";
    runQ(q,function(data){
      var co_in_ob = {}, data = data.aggregations.country_inq.buckets;
      //If I keep it 100000, only two countries are above it. 
      var max=100000;
      for(var i=0;i<data.length;i++){ 
        co_in_ob[data[i]["key"]] = data[i]["sum_v"]["value"];
      }
      $(".mapLegend .keys").empty();
      var range = Object.keys(colors), ct=0;
      for(var color in colors){
        var val = parseInt(color);
        if(ct < range.length-1){
          $(".mapLegend .keys").append("<div class='key'><div class='label'>"+(val >= 1000 ? (val/1000)+"k" : val )+"</div><div style='background: linear-gradient(to right, "+colors[range[ct]]+","+colors[range[ct+1]]+");' class='color'></div></div>");
          ct++;
        }
      }
      $(".mapLegend .keys").append("<div class='key genocide'><div class='label'>Genocide</div><div style='background: "+genocideColor+"' class='color'></div></div>");
      $(".mapLegend .keys").append("<div class='key nodata'><div class='label'>No Data</div><div style='background: "+baseColorLight+"' class='color'></div></div>");
      var myCustomStyle = {
          fill: true,
          fillColor: baseColorLight,
          fillOpacity: 0.7,
          color : bgColor,
      }
      //This is just stupid.
      var zoomLevel = 3.1 + parseInt((window.innerHeight-700)/400)*.5;
      if(!mapObj){
        mapObj = L.map('mapp',{
            center : [2.4530702,19.035771],
            zoom : zoomLevel,
            minZoom : zoomLevel,
            dragging : true,
            touchZoom  : false,
            scrollWheelZoom : true,
            doubleClickZoom : false,
            boxZoom : false,
            zoomControl : false,
            attributionControl : false
        });
      }else{
        mapObj.eachLayer(function (layer) {
            mapObj.removeLayer(layer);
        });
      }
      L.geoJson(africa, {
          clickable: true,
          style: myCustomStyle,
          onEachFeature : function(d,l){
            var c = d.properties.iso_a3;
            var cname = d.properties.sovereignt;
              l.options = l.options || l._options;
              if(l.options)
              l.options.className = "countryGeo country_"+c;
              var val = co_in_ob[c],ct=0,scale;
              if(val){
                for(var color in colors){
                  var cv = parseInt(color);
                  if(val < cv){
                    scale = chroma.scale([colors[range[ct-1]],colors[cv]]);
                    val = val/cv;
                    break;
                  }
                  ct++;
                }
                l.setStyle({
                  fillColor: scale ? scale(val).hex() : genocideColor
                });
              }
              
              l.on("click",function(){
                highlighCountry(cname,c);
              }); 
            
          }
      }).addTo(mapObj);

      highlighCountry();
    },"ucdp","event");
  }

  //Just the timeline 1820-2014
  var drawTimeline = function(){
    var marginTop =20, marginRight=0, timeInterval =7, marginLeft=0, fontSize=window.innerHeight*.02;
    var yrInterval = parseInt((timePeriod.to  - timePeriod.from)/timeInterval);

    var yrStart = timePeriod.from;

    var x = d3.scaleLinear()
            .domain([timePeriod.from-1, timePeriod.to+1])
            .range([marginLeft, w]);
    var wy = x(timePeriod.from+1) - x(timePeriod.from);
    timeline.append("line")
            .attr("x1",x(timePeriod.from-1))
            .attr("y1",marginTop)
            .attr("x2",x(timePeriod.to+1))
            .attr("y2",marginTop)
            .attr("stroke",baseColor);


    for(var i=timePeriod.from-1;i<=timePeriod.to;i++){
      timeline.append("rect")
          .attr("x", x(i))
          .attr("y",marginTop-2)
          .attr("width","2px")
          .style("height","4px")
          .style("fill",bgColor);
    }
    while(true){
      timeline.append("text")
          .attr("x", x(yrStart))
          .attr("y",marginTop)
          .attr("text-anchor","left")
          .attr("alignment-baseline","ideographic")
          .style("font-size",fontSize+"px")
          .style("font-weight","bold")
          .text(yrStart);

      if(yrStart > timePeriod.to){
        break;
      }else{
        yrStart += yrInterval;
      }
    }
  };

  //The unemployment indicator
  var drawIndicator = function(type,dataUnem, color,classs,impactDomain,indi){
    var  marginLeft=w*.05,lines = [];

    var ht = parseInt(indi.attr("height"));
    
    var x = d3.scaleLinear()
              .domain([timePeriod.from, timePeriod.to+1])
              .range([marginLeft, w]);
    var y = d3.scaleLinear()
              .domain(impactDomain)
              .range([0, ht]);

    var indi_g = indi.append("g")
        .attr("class",classs)
        .attr("type",type);

    $(".keys .parameter .label").text(indicator);
    $(".keys .parameter .label").attr("data-help",type);
    
   
    var ct = 0, x1, x2, y1=y(impactDomain[1]), y2=y(impactDomain[1]), value, strokeColor;
    for(var i=timePeriod.from;i<=timePeriod.to;i++){
      x1 = x(i), value = 0, dashed=false, interpolating = false;
      var yrData = indi_g.append("g");

      if(dataUnem[ct] && dataUnem[ct].key == i){
        y2 = y(dataUnem[ct].value);
        value = dataUnem[ct].value;
        strokeColor=color;
        if(y2<=0){
          y2 = 1;
          dashed = true;
        }
        if(y2>=ht){
          y2 = ht-1;
          dashed = true;
        }
        ct++;
        //Adding circle points for years which have values.
        yrData.append("circle")
            .attr("cx",x(i+0.5))
            .attr("cy",y2)
            .attr("r","4px")
            .style("fill",secondHighlightColor);

      }else{
        interpolating = true;
        strokeColor=baseColorLight;
        if(ct ==0){
          //Interpolating in the case of values before the first value
          y2 = y(dataUnem[ct].value);
          value = dataUnem[ct].value;
        }
      }
      if(!interpolating){
        yrData.attr("value",parseInt(value)+"("+i+")")
              .attr("class","tooltipValue")
              .style("cursor","pointer")
      }
      if(i>timePeriod.from && ct>1){
        yrData.append("line")
            .attr("x1", x1)
            .attr("x2", x1)
            .attr("y1", y1)
            .attr("y2", y2)
            .attr("stroke", strokeColor)
            .attr("stroke-width",2)
            .attr("value",value)
      }
      
      if(i<(timePeriod.to+1)){
        x2 = x(i+1);
        yrData.append("line")
              .attr("x1", x1)
              .attr("x2", x2)
              .attr("y1", y2)
              .attr("y2", y2)
              .style("stroke-dasharray", !dashed ? ("0") : ("2, 2"))
              .attr("stroke", strokeColor)
              .attr("stroke-width",2);
      }
      y1=y2;
    }
   
    //Adding the y axis labels here
    var impactInterval = parseInt((impactDomain[0]-impactDomain[1])/2);
    for(var i=0; i<=2;i++){
      var txtLable = indi_g.append('g')
      var val = parseInt(i*impactInterval+impactDomain[1]);
      txtLable.append("rect")
            .attr("x", 0)
            .attr("y", y(val)-10*(2-i))
            .attr("width",15)
            .attr("height",15)
            .attr("fill",bgColor);
      txtLable.append('foreignObject')
                        .attr('x', 0)
                        .attr('y', y(val)-7.5*(2-i))
                        .attr('width', 15)
                        .attr('height', 15)
                        .append("xhtml:div")
                        .html('<div style="font-size:75%;color:'+baseColorLight+';">'+(val>1000 ? parseInt(val/1000)+"k": val)+'</div>')
    }
  };

  var tooltipEvents = function(){
    var tooltipTimer;
    $(".info").unbind('click').on("click",function(){
          // clearTimeout(tooltipTimer);
          var ev = event;
          var el = $(this);
            var x = ev.x;
            if(x + .3*window.innerWidth > window.innerWidth){
              x = x - .3*window.innerWidth;
            }
            $(".tooltip").css({
              "top" : ev.y+10 + "px",
              "left" : x + "px",
            }).html(helpText[el.data("help")]);
            $(".tooltipCont").show();
      });
      $(".tooltipValue").unbind('click').on("click",function(){
        $(".tooltip").css({
            "top" : event.y + "px",
            "left" : event.x + "px",
        }).html($(this).attr("value"));
        $(".tooltipCont").show();
      });

      // $(".tooltipCont").unbind('mouseenter mouseleave').hover(function(){
      //     if(!$(event.target).hasClass("tooltip")){
      //       var el = $(this);
      //       tooltipTimer = setTimeout(function(){
      //         el.hide();  
      //       },0);
      //     }
      // })
      $(".tooltipCont").unbind('click').on("click",function(){
          if(!$(event.target).hasClass("tooltip")){
            $(this).hide();  
          };
      });
  };

  /**
  Almost any other interaction that you see.
  **/
  var otherEvents = function(){
      $(".country .selected").unbind("click").on("click",function(){
        $(".right .list").toggle();
      });
      $(".right .list .listItem").unbind("click").on("click",function(){
        $(".country .selected").text($(this).text());
        countrySelected = [$(this).text(),$(this).data("code")];
        $(".right .list").toggle();
        SSAConflict.reinit();
      });
      $(".africaToggle").unbind("click").on("click",function(){
        var map = $(".mapContainer");
        if(map.hasClass("toggled")){
          map.animate({"height": "0px"}).removeClass("toggled");  
        }else{
          map.animate({"height": .72*window.innerHeight}).addClass("toggled");
        }
      });
      $("#dyads .btn").on("click",function(){
        var el = $(this);
        $("#dyads .btn").removeClass("active");
        if(el.hasClass("evTimeline")){
          if($("#eventTimeline").children().length){
            $("#dyadsCont").hide();
            $("#eventTimeline").show();
          }else{
            allEventTimeline();  
          }
        }else{
          $("#eventTimeline").hide();
          $("#dyadsCont").show();
        }
        el.addClass("active")
      })
      
  }


  var counflictOfCountry = function(){

  };

  return {

    addEvents : function(){
      tooltipEvents();
      otherEvents();
    },

    drawTimeline : function(){
      drawTimeline();
    },
    setup : function(width){
      var ww = width || w;
      dyadsCont = d3.select("#dyads")
                    .append("svg")
                    .attr("width", ww)
                    .attr("height", $("#dyads").height() - $("#dyads .label").height())
                    .attr("id","dyadsCont");
      eventTimeline = d3.select("#dyads")
                    .append("svg")
                    .attr("width", ww)
                    .attr("height", $("#dyads").height() - $("#dyads .label").height())
                    .attr("id","eventTimeline");

      timeline = d3.select(".timeline .container").append("svg")
                       .attr("id","timeline")
                       .attr("width", ww)
                       .attr("height",$(".timeline").height());
      drawMapSkeleton();
      
      $.each(Object.keys(countryCodes).sort(),function(i,v){
        $(".right .list").append("<div class='listItem' data-code='"+countryCodes[v]+"'>"+v+"</div>");
      })
    },

    clear : function(){
        $("#dyadsCont").empty();
        $("#timeline").empty();
        $(".indicator svg").remove();
    },
    reinit : function(){
        SSAConflict.clear();
        drawMapSkeleton();
        highlighCountry();
    },

    init : function(){
          SSAConflict.renderConflictCountry();
          SSAConflict.drawTimeline();
          SSAConflict.renderIndicator("ineq");
          SSAConflict.renderIndicator("cr");
          SSAConflict.renderIndicator("health");
          setTimeout(function(){
            SSAConflict.addEvents();
            if(device.isMobile){
              $(".mapContainer").animate({"height": "0px"}).removeClass("toggled");    
            }
          },1500)
    },

    renderConflictCountry : function(){
        var q = es_queries["conflict_country_yr"];
        q["query"]["bool"]["must"][0]["term"]["ccd"]["value"] = countrySelected[1];
        q["query"]["bool"]["must"][1]["range"]["year"] = {"gte" : timePeriod.from,"lte" : timePeriod.to};
        runQ(q,function(data){
            var data = data.aggregations.by_year.buckets;
            var ht = parseInt(dyadsCont.attr("height")), marginLeft=w*.05;
            var impactDomain = [20000,0];
            var x = d3.scaleLinear()
                      .domain([timePeriod.from, timePeriod.to+1])
                      .range([marginLeft, w]);
            var y = d3.scaleLinear()
                      .domain(impactDomain)
                      .range([$("#dyads .label").height(), ht]);
            for(var i=0;i<data.length;i++){
              var ob = data[i];
              var deathsHigh = ob["clarity"]["buckets"][0]["high"]["value"] + (ob["clarity"]["buckets"].length > 1 ? ob["clarity"]["buckets"][1]["high"]["value"] : 0);

              dyadsCont.append("rect")
                       .attr("x",x(ob.key))
                       .attr("y",y(deathsHigh))
                       .attr("width", x(ob.key+1)-x(ob.key))
                       .attr("height", ht-y(deathsHigh))
                       .attr("value",ob.key+"<br>"+"Number of conflicts - "+ob.doc_count)
                       .attr("class","tooltipValue")
                       .style("fill",deathsHigh > impactDomain[0] ? highDeathColor : highlightColor)
                       .style("opacity",dontShowUncertainty ? "0.8" : "0.6");
              if(!dontShowUncertainty){
                var deathsBest = ob["clarity"]["buckets"][0]["best"]["value"];
                dyadsCont.append("rect")
                       .attr("x",x(ob.key))
                       .attr("y",y(deathsBest))
                       .attr("width", x(ob.key+1)-x(ob.key))
                       .attr("height", ht-y(deathsBest))
                       .attr("value",ob.key+"<br>"+"Number of conflicts - "+ob.doc_count)
                       .attr("class","tooltipValue")
                       .style("fill",highlightColor)
              }
            }


            

            //Adding the y axis labels here
            var impactInterval = parseInt((impactDomain[0]-impactDomain[1])/2);
            for(var i=0; i<=2;i++){
              var txtLable = dyadsCont.append('g')
              var val = parseInt(i*impactInterval+impactDomain[1]);
              dyadsCont.append("line")
                     .attr("x1",0)
                     .attr("y1",y(val))
                     .attr("x2",x(timePeriod.to+1))
                     .attr("y2",y(val))
                     .style("stroke",baseColorLight)
                     .style("stroke-dasharray", ("3, 3"))
                     .style("stroke-width",0.5);

              txtLable.append('foreignObject')
                                .attr('x', 0)
                                .attr('y', i==0 ? y(val)-7.5*(2-i) : y(val))
                                .attr('width', 15)
                                .attr('height', 15)
                                .append("xhtml:div")
                                .html('<div class="yLabel">'+(val >=1000 ? val/1000 + "k" : val)+'</div>')
            }
        });
    },

    //This is where the indicator which suffers is rendered
    renderIndicator : function(indicatorType){
        var indi = d3.select(".indicator."+indicatorType).append("svg")
                       .attr("id","indicator")
                       .attr("width", w)
                       .attr("height", $(".indicator").height()-$(".indicator .label").height());
        var indiq = es_queries["indicator"][indicatorType];

        var colorToSend =  secondHighlightColor || indiq["color"];
        var q = indiq["q"]["percentile"];
        q["aggs"]["perc"]["percentiles"]["percents"] = indicatorPercentile;
        runQ(q,function(data){
            var impactDomain = [parseFloat(data.aggregations.perc.values[indicatorPercentile[0]+".0"]),parseFloat(data.aggregations.perc.values[indicatorPercentile[1]+".0"])];
            var indiq = es_queries["indicator"][indicatorType];
            var q = indiq["q"]["country"];
            q["query"]["bool"]["must"][0]["terms"]["ccode"] = [countrySelected[1]];
            q["query"]["bool"]["must"][1]["range"]["yr"] = {"gte" : timePeriod.from,"lte" : timePeriod.to};
            runQ(q,function(data){
                drawIndicator(indicatorType,data.hits.hits.map(function(d){
                    return {
                      "key" : d._source.yr,
                      "value" : d._source.value
                    }
                  }),colorToSend,"countryIndicator",impactDomain,indi);
            },indiq.index,indiq.type);
        },indiq.index,indiq.type);
    }

  }

})();


SSAConflict.setup();


