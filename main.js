///////////////////////////////////////////////////////
// Generic code

// set some global variables for mapping

var startDate = dateFormat(new Date(), "yyyy-mm-dd"); // get todays date code
var displayIndex; 
var startData = "SoilDef";
var displayData = "SoilDef_zero";
var forecastdisplayIndex;
var forecaststartData;
var forecastdisplayData;
var cols;
var labs;

// Fetch JSON 
function fetchJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                var jsonData = JSON.parse(xhr.responseText);
                callback(jsonData);
            } else {
                // error ... do something 
                alert("Failed to load", url);
            }
        } 
    }
    xhr.open("GET", url, true);
    xhr.send("");
}

// creating legend

function createLegend(cols,labs,elementname='legend-body',containername='legend',orientation = "horizontal"){
    // Set up legend overlay
    // a list of colours and values
    //var cols = ["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"];
    //var labs = ['-100','-80','-60',"-40","-20","0","20"];
        
        if(orientation == "horizontal"){

            var values = document.createElement('div');
            var keys = document.createElement('div');
            var items = document.createElement('div');
            for (i = 0; i < labs.length; i++) {
                var lab = labs[i];
                var col = cols[i];
                var key = document.createElement('span');
                var value = document.createElement('span');
                key.className = 'legend-key';
                key.style.backgroundColor = col;
                key.style.marginRight = '0.1rem';          
                value.innerHTML = lab;
                value.style['text-align'] = 'right';
                value.style['writing-mode'] = 'vertical-rl';
                value.style.fontSize = '0.7rem';
                value.style.maxWidth= '0.8rem';
                values.appendChild(value);
                keys.appendChild(key);

            };
            values.className='legend-body';
            keys.className='legend-body';
            items.append(keys);
            items.append(values);
            items.style.marginTop = '0.2rem';
        }else if(orientation == "vertical"){
            var items = document.createElement('div');

            for (i = 0; i < labs.length; i++) {
                var lab = labs[i];
                var col = cols[i];
                var item = document.createElement('div');
                var key = document.createElement('span');
                key.className = 'legend-key';
                key.style.backgroundColor = col;
                var value = document.createElement('span');
                value.innerHTML = lab;
                item.appendChild(key);
                item.appendChild(value);
                items.appendChild(item);
            };

        }else{
            console.error("please select a valid orientation");
        };
        document.getElementById(elementname).innerHTML = items.outerHTML;
};

// Change farm map variable

function getfarmVar(set){
    startData = set.value;

    if(displayIndex < 7){displayData = set.value + "_hist"}else{displayData = set.value +"_zero"};
    console.log(`getvar displayIndex is: ${displayIndex} and displayData is: $displayData}`);
    if(set.value === "SoilDef"){
       //update the map
       map.setPaintProperty('set-fills','fill-color',[
        "case",
        [
            "<",
            ["to-number",["at",["number",displayIndex],["get",["string",displayData,startData]]],0],
            -998
        ],
        "#ffffff",
        ["interpolate",
                    ["linear"],
                    ["number",["at",["number",displayIndex],["get",["string",displayData,startData]]],0],
                    -100,"#d53e4f",
                    -80,"#fc8d59",
                    -60,"#fee08b",
                    -40,"#ffffbf",
                    -20,"#e6f598",
                    -0,"#99d594",
                    20,"#3288bd",
                ]]);
        //update the legend colour list
        cols = ["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"];
        labs = ['-100','-80','-60',"-40","-20","0","20"];
        } else if (set.value === "ET"){
            map.setPaintProperty('set-fills','fill-color',[
                "case",
                [
                    "<",
                    ["to-number",["at",["number",displayIndex],["get",["string",displayData,startData]]],0],
                    -998
                ],
                "#ffffff",
                ["interpolate",
                    ["linear"],
                    ["number",["at",["number",displayIndex],["get",["string",displayData,startData]]],0],
                    0,"#d53e4f",
                    2,"#fc8d59",
                    4,"#fee08b",
                    6,"#ffffbf",
                    8,"#e6f598",
                    10,"#99d594",
                    12,"#3288bd",
                ]]);
                //update the legend colour list
                cols = ["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"];
                labs = ['0','2','4',"6","8","10","12"];
        } else if (set.value === "NetApp"){
                    map.setPaintProperty('set-fills','fill-color',[
                        "case",
                        [
                            "<",
                            ["to-number",["at",["number",displayIndex],["get",["string",displayData,startData]]],0],
                            -998
                        ],
                        "#ffffff",
                        ["interpolate",
                    ["linear"],
                    ["number",["at",["number",displayIndex],["get",["string",displayData,startData]]],0],
                    0,"#d53e4f",
                    20,"#fc8d59",
                    40,"#fee08b",
                    60,"#ffffbf",
                    80,"#e6f598",
                    100,"#99d594",
                    120,"#3288bd",
                ]]);
                //update the legend colour list
                cols = ["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"];
                labs = ['0','20','40',"60","80","100","120"];
        };
createLegend(cols,labs);
};

// Change forecast map variable

function getforecastVar(set){
    forecaststartData = set.value;
    forecastdisplayData = set.value;

    if(set.value === "DailyPrecip50Pct_SFC"|set.value === "DailyPrecip25Pct_SFC"|set.value === "DailyPrecip75Pct_SFC"|set.value === "DailyCWU_SFC"){
       //update the map
       console.log(set.value);
       map.setPaintProperty('zone-fills','fill-color',[
        "case",
        [
            "<",
            ["to-number",["at",["number",forecastdisplayIndex],["get",["string",forecastdisplayData,forecaststartData]]],0],
            -998
        ],
        "#ffffff",
        ["interpolate",
                    ["linear"],
                    ["to-number",["at",["number",forecastdisplayIndex],["get",["string",forecastdisplayData,forecaststartData]]],0],
                    1,"#9e0142",
                    5,"#d53e4f",
                    10,"#f46d43",
                    15,"#fdae61",
                    20,"#fee08b",
                    40,"#e6f598",
                    60,"#abdda4",
                    80,"#66c2a5",
                    100,"#3288bd",
                    120,"#5e4fa2",
                ]]);
        //update the legend colour list
        cols = ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"];
        labs = ['1','5','10',"15","20","40","60","80","100","120"];
        } else if (set.value === "DailyPoP_SFC"){
            map.setPaintProperty('zone-fills','fill-color',[
                "case",
                [
                    "<",
                    ["to-number",["at",["number",forecastdisplayIndex],["get",["string",forecastdisplayData,forecaststartData]]],0],
                    -998
                ],
                "#ffffff",
                ["interpolate",
                    ["linear"],
                    ["to-number",["at",["number",forecastdisplayIndex],["get",["string",forecastdisplayData,forecaststartData]]],0],
                    10,"#9e0142",
                    20,"#d53e4f",
                    30,"#f46d43",
                    40,"#fdae61",
                    50,"#fee08b",
                    60,"#e6f598",
                    70,"#abdda4",
                    80,"#66c2a5",
                    90,"#3288bd",
                    100,"#5e4fa2",
            ]]);
                //update the legend colour list
                cols = ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"];
                labs = ['10','20','30',"40","50","60","70","80","90","100"];
        } else if (set.value === "MinT_SFC"|set.value === "MaxT_SFC"|set.value === "Daily_Radn_SFC"){
                    map.setPaintProperty(
                        'zone-fills',
                        'fill-color',
                        [
                            "case",
                            [
                                "<",
                                ["to-number",["at",["number",forecastdisplayIndex],["get",["string",forecastdisplayData,forecaststartData]]],0],
                                -998
                            ],
                            "#ffffff",
                            [
                                "interpolate",
                                ["linear"],
                                ["to-number",["at",["number",forecastdisplayIndex],["get",["string",forecastdisplayData,forecaststartData]]],0],
                                0,"#3288bd",
                                5,"#66c2a5",
                                10,"#abdda4",
                                15,"#e6f598",
                                20,"#fee08b",
                                25,"#fdae61",
                                30,"#f46d43",
                                35,"#d53e4f",
                                40,"#9e0142",
                            ]
                        ]
                    );
                //update the legend colour list
                cols = ["#5e4fa2","#3288bd","#66c2a5","#abdda4","#e6f598","#fee08b","#fdae61","#f46d43","#d53e4f","#9e0142"];
                labs = ['-5','0','5',"10","15","20","25","30","35","40"];
        };
createLegend(cols,labs);
};


// Change map background layer

function switchLayer(layer) {
    var layerId = layer.id;
    map.setStyle('mapbox://styles/mapbox/' + layerId);  
    }

// generate wind direction

function formatWindDirection(rotation="none",direction="N",speed="< 1"){
    // returns a key-value pair of rotation, direction and speed, given either a rotation or a direction and speed
    // rotation is evaluated first so if both a valid rotation and valid direction are supplied the result for the valid rotation will be returned
    // rotation is assumed to be clockwise from north. therefore values >360 and <0 are invalid.
    // direction must be one of N,NE,NNE, ENE etc.. and must be capitals
    // if a rotation is supplied the given rotation is returned. IF a direction is supplied the rotation is given to within +/- 11.25 degrees.
    // speed is used to change direction to "CALM" if speed is < 1 km/h and to force the rotation to be 0.
    // in future speed may be used to change colors / icons etc.

    let out = {"speed":speed,"rotation":null,"direction":null};
    
    if(typeof(rotation)==='number'){
        out.rotation = rotation;
        if(348.75 <= rotation && rotation <= 360 || rotation < 11.25){
            out.direction = "S";
        } else if(11.25 <= rotation && rotation < 33.75 ){
            out.direction = "SSW";
        } else if(33.75 <= rotation && rotation < 56.25 ){
            out.direction = "SW";
        } else if(56.25 <= rotation && rotation < 78.75 ){
            out.direction = "WSW";
        } else if(78.75 <= rotation && rotation < 101.25 ){
            out.direction = "W";
        } else if(101.25 <= rotation && rotation < 123.75 ){
            out.direction = "WNW";
        } else if(123.75<= rotation && rotation < 146.25 ){
            out.direction = "NW";
        } else if(146.25 <= rotation && rotation < 168.75 ){
            out.direction = "NNW";
        } else if(168.75 <= rotation && rotation < 191.25 ){
            out.direction = "N";
        } else if(191.25<= rotation && rotation < 213.75 ){
            out.direction = "NNE";
        } else if(213.75 <= rotation && rotation < 236.25 ){
            out.direction = "NE";
        } else if(236.25 <= rotation && rotation < 258.75 ){
            out.direction = "ENE";
        } else if(258.75 <= rotation && rotation < 281.25 ){
            out.direction = "E";
        } else if(281.25 <= rotation && rotation < 303.75 ){
            out.direction = "ESE";
        } else if(303.75 <= rotation && rotation < 326.25 ){
            out.direction = "SE";
        } else if(326.25 <= rotation && rotation < 348.75 ){
            out.direction = "SSE";
        } else {
            console.log("please provide valid rotation");
            return;
            }
    } else{
        out.direction = direction;
        switch (direction){
            case "S": out.rotation = 0;
            break;
            case "SSW": out.rotation = 22.5;
            break;
            case "SW": out.rotation = 45;
            break;
            case "WSW": out.rotation = 67.5;
            break;
            case "W": out.rotation = 90;
            break;
            case "WNW": out.rotation = 112.5;
            break;
            case "NW": out.rotation = 135;
            break;
            case "NNW": out.rotation = 157.5;
            break;
            case "N": out.rotation = 180;
            break;
            case "NNE": out.rotation = 202.5;
            break;
            case "NE": out.rotation = 225;
            break;
            case "ENE": out.rotation = 247.5;
            break;
            case "E": out.rotation = 270;
            break;
            case "ESE": out.rotation = 292.5;
            break;
            case "SE": out.rotation = 315;
            break;
            case "SSE": out.rotation = 337.5;
            break;
            case "CALM": out.rotation = 0;
            default: {console.log("please use a valid direction");
            return ;
            };
        }
    }
    if(speed < 1 || direction==="CALM"){
        out.speed= "< 1";
        out.direction="CALM";
        out.rotation=0;
    } else{
        out.speed = speed;
    }
    return out;
};

// creating a date jumper with selector

function createDateSelector(dates,elementname,today,short,mid){
    var dateselector = document.createElement('div');
    var jumpback = document.createElement('button');
    jumpback.className = 'btn-dark selectorbtn';
    jumpback.id = 'jumpbackdate';
    jumpback.innerHTML = "<i class=icon-jumpleft></i>";
    var jumpforward = document.createElement('button');
    jumpforward.className = 'btn-dark selectorbtn';
    jumpforward.id = 'jumpforwarddate';
    jumpforward.innerHTML = "<i class=icon-jumpright></i>";
    var stepback = document.createElement('button');
    stepback.className = 'btn-dark selectorbtn';
    stepback.innerHTML = "<i class=icon-step_left></i>";
    stepback.id='backdate';
    console.log(stepback);
    var stepforward = document.createElement('button');
    stepforward.className = 'btn-dark selectorbtn';
    stepforward.id = 'fowarddate'; 
    stepforward.innerHTML = "<i class=icon-step_right></i>";
    var backbtns = document.createElement('div');
    backbtns.appendChild(jumpback);
    backbtns.appendChild(stepback);
    var fwdbtns = document.createElement('div');
    fwdbtns.appendChild(stepforward);
    fwdbtns.appendChild(jumpforward);
    backbtns.style.width = '33%';
    fwdbtns.style.width = '33%';
    var selector = document.createElement('select');
    selector.id = 'dateselect';
    selector.className = 'dateselector';
    var opt;
    for(i=0; i<dates.length; i++){
        opt = document.createElement('option');
        if(dates[i] < today){
            opt.className = 'histforecast';
            if(window.location.hash.startsWith("#forecasts")){opt.style.display= 'none'};
        }else if(dates[i] >= today & dates[i] < short){
            opt.className = 'shortforecast';
        }else if(dates[i] >= short & dates[i] < mid){
            opt.className = 'midforecast';
        }else{
            opt.className = 'longforecast';
        };
        opt.innerHTML = dateFormat(dates[i],"dddd dd mmmm");
        opt.value = i;
        if(dates[i] == today){opt.selected = true};
        opt.onclick = 'jumptodate(this)'; 
        selector.appendChild(opt);
    };
    dateselector.appendChild(backbtns);
    dateselector.appendChild(selector);
    dateselector.appendChild(fwdbtns);
document.getElementById(elementname).innerHTML = dateselector.innerHTML;
};

// a function to increment date by one
function forecastdatePlusOne(){
    let maxlen = document.getElementById('dateselect').length - 1;
    let temp = forecastdisplayIndex + 1;
    if(temp > maxlen){temp = maxlen};
    forecastdisplayIndex = temp;
    getforecastVar(document.getElementById('forecastplotvar'));
    document.getElementById('dateselect')[temp].selected=true;
};
// a function to step date back by one
function forecastdateMinusOne(){
    let temp = forecastdisplayIndex - 1;
    if(temp < 7){temp = 7};
    forecastdisplayIndex = temp;
    getforecastVar(document.getElementById('forecastplotvar'));
    document.getElementById('dateselect')[temp].selected=true;
};
// a function to increment date by one
function farmdatePlusOne(){
    let maxlen = document.getElementById('dateselect').length - 1;
    let temp = displayIndex + 1;
    if(temp > maxlen){temp = maxlen};
    displayIndex = temp;
    getfarmVar(document.getElementById('farmplotvar'));
    document.getElementById('dateselect')[temp].selected=true;
};
// a function to step date back by one
function farmdateMinusOne(){
    let temp = displayIndex - 1;
    if(temp < 0){temp = 0};
    displayIndex = temp;
    getfarmVar(document.getElementById('farmplotvar'));
    document.getElementById('dateselect')[temp].selected=true;
};
// a function to jump forward to next date set
function dateJumpForward(){

};
// a function to jump back to last date set
function dateJumpBackward(){

};
// a function to jump to a given date
function jumpToDate(){

};


///////////////////////////////////////////////////////
// Load the map
var map_loaded = false;
var zones;
var sets;
var stations;


mapboxgl.accessToken = 'pk.eyJ1IjoiYnJvbnNvbnBoaWxpcHBhIiwiYSI6ImNqeGp1cWFzNjA3dGEzbnFmMGRvcTZjaXkifQ.gKYwAr9h6yprnsOG3LiU-w';
const map = new mapboxgl.Map({
    container: 'mainmap',
    //style: 'mapbox://styles/bronsonphilippa/cjy9int3m0kdx1cqjiay34tqt',
    //style: 'mapbox://styles/mapbox/streets-v11',
    //style: 'mapbox://styles/mapbox/light-v10',
    style: 'mapbox://styles/mapbox/dark-v10',
    //style: 'mapbox://styles/mapbox/outdoors-v11',
    //style: 'mapbox://styles/mapbox/satellite-v9',
    center: [147.420,-19.800],
    zoom: 10
});

map.on('style.load',function(){
    finishLoading();
});

map.on('load', function() {
    map.loadImage("assets/bom-station-icon.png", function(error,image){
        if (error) throw error;
        map.addImage('bom-icon', image)
    });
    map_loaded = true;
    finishLoading();
});
//get the latest forecast geojson from azure
fetchJSON("https://cssipdata.blob.core.windows.net/weather-forecasts/forecast.geojson", function(data) {
    var metadata = data.metadata;
    delete data.metadata;
    zones = {metadata: metadata, data: data};
    finishLoading();
});
fetchJSON("https://cssipdata.blob.core.windows.net/irrigweb-data/aalinton@bigpond.com/Latest.geojson", function(data) {
    var metadata = data.metadata;
    delete data.metadata;
    sets = {metadata: metadata, data: data};
    finishLoading();
});



// When a click occurs on a feature in the bom-stations layer, open a popup at the
// location of the feature, with ....

map.on('click', 'bom-stations', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    console.log(`${e.features[0].properties.local_times[JSON.parse(e.features[0].properties.local_times).length-1]} on ${e.features[0].properties.apparent_t[JSON.parse(e.features[0].properties.apparent_t).length-1]}`);
    var dir = formatWindDirection(null,JSON.parse(e.features[0].properties.wind_dir)[JSON.parse(e.features[0].properties.wind_dir).length-1],JSON.parse(e.features[0].properties.wind_spd_kmh)[JSON.parse(e.features[0].properties.wind_spd_kmh).length-1]);
    var windicon;
    if(dir.direction==="CALM"){windicon = "asset/wind_CALM.png"} else {windicon = "assets/wind_S.png"};
    var description =  
        '<div class="popup-content">' +
        `<div title="site">${e.features[0].properties.name}</div>` +
        `<div title="${e.features[0].properties.last_issued}">${e.features[0].properties.last_issued.slice(10,22)}</div>` +
        `<div title="Current temperature"><img src="assets/temp.png" class="inline-icon">
        ${JSON.parse(e.features[0].properties.apparent_t)[JSON.parse(e.features[0].properties.apparent_t).length-1]}&deg;C</div>` +
        //`<div title="Wind direction and speed"><img src="assets/wind_${JSON.parse(e.features[0].properties.wind_dir)[JSON.parse(e.features[0].properties.wind_dir).length-1]}.png" class="inline-icon" title="Wind from the east">
        `<div title="Wind direction and speed"><img src=${windicon} class="inline-icon" style="transform:rotate(${dir.rotation.toFixed()}deg);" title="Wind from the east">
        ${dir.speed} km/h
        ${dir.direction}</div>` +
        `<div title="Rain since 9am"><img src="assets/rain.png" class="inline-icon">
        ${JSON.parse(e.features[0].properties.rain_trace)[JSON.parse(e.features[0].properties.rain_trace).length-1]} mm</div>` +
        '</div>';
     
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
});

// fetch BOM observations geojson from Azure blob storage
// fetchJSON("weather-stations.geojson", function(data) {
    fetchJSON("https://cssipdata.blob.core.windows.net/bom-observed/Observations.geojson", function(data) {
        var metadata = data.metadata;
        delete data.metadata;
        stations = {metadata: metadata, data: data};
        finishLoading();
    });

function finishLoading() {
    if (!map_loaded || zones === undefined || sets == undefined || stations == undefined) {
        return;
    }
    // Load zone data and add it to the map
    map.addSource("zones", {"type": "geojson", "data": zones.data});
    
    // add fill layer for forecasts
    forecastdisplayIndex = zones.metadata.dates.indexOf(startDate); // get index of todays date
    forecaststartData = "DailyPrecip50Pct_SFC";
    forecastdisplayData = "DailyPrecip50Pct_SFC";
    map.addLayer({
        "id": "zone-fills",
        "type": "fill",
        "source": "zones",
        "layout": {
            "visibility": "none"
        },
        "paint": {
            "fill-color":
            [
                "case",
                [
                    "<",
                    ["to-number",["at",["number",forecastdisplayIndex],["get",["string",forecastdisplayData,forecaststartData]]],0],
                    -998
                ],
                "#ffffff",
                ["interpolate",
                   ["linear"],
                    ["number",["at",["number",forecastdisplayIndex],["get",["string",forecastdisplayData,forecaststartData]]],0],
                    1,"#9e0142",
                    5,"#d53e4f",
                    10,"#f46d43",
                    15,"#fdae61",
                    20,"#fee08b",
                    40,"#e6f598",
                    60,"#abdda4",
                    80,"#66c2a5",
                    100,"#3288bd",
                    120,"#5e4fa2",
            ]],
            "fill-opacity": [
                "case",
                ["any", ["boolean", ["feature-state", "hover"], false], ["boolean", ["feature-state", "active"], false]],
                1,
                0.8
            ]
        }
    });
    
    map.addLayer({
        "id": "zone-borders",
        "type": "line",
        "source": "zones",
        "filter": ["has", "cluster"],
        "layout": {
            "visibility": "none"
        },
        "paint": {
          "line-color": [
            "match",
            ["get", "cluster"],
            "blue", "#0000FF",
            "green", "#008000",
            "grey", "#808080",
              "orange", "#FFA500",
              "red", "#FF0000",
            "#ffffff"
          ],
            "line-width": [
                "case",
                ["boolean", ["feature-state", "active"], false],
                5,
                3
            ]
        }
      });

    // Load set data
    map.addSource("sets", {"type": "geojson", "data": sets.data});
    displayIndex = sets.data.features.filter((x) => x.properties.GraphDate.length > 1)[0].properties.GraphDate.indexOf(startDate); // get index of todays date
    startData = "SoilDef";
    displayData = "SoilDef_zero";
    map.addLayer({
        "id": "set-fills",
        "type": "fill",
        "source": "sets",
        "filter": ["==", "plot","yes"],
        "layout": {
            "visibility": "none"
        },
        "paint": {
            "fill-color":
            [
                "case",
                [
                    "<",
                    ["to-number",["at",["number",displayIndex],["get",["string",displayData,startData]]],0],
                    -998
                ],
                "#ffffff",
                ["interpolate",
                   ["linear"],
                    ["number",["at",["number",displayIndex],["get",["string",displayData,startData]]],0],
                -100,"#d53e4f",
                -80,"#fc8d59",
                -60,"#fee08b",
                -40,"#ffffbf",
                -20,"#e6f598",
                -0,"#99d594",
                20,"#3288bd",
            ]],
            "fill-opacity": [
                "case",
                ["any", ["boolean", ["feature-state", "hover"], false], ["boolean", ["feature-state", "active"], false]],
                1,
                0.8
            ]
        }
    });
    map.addLayer({
        "id": "set-borders",
        "type": "line",
        "source": "sets",
        "filter": ["==", "plot","yes"],
        "layout": {
            "visibility": "none"
        },
        "paint": {
            "line-color": "#007BFF",
            "line-width": [
                "case",
                ["boolean", ["feature-state", "active"], false],
                5,
                0
            ]
        }
    });

    // Load weather station data
    map.addSource("stations", {"type": "geojson", "data": stations.data});
    map.addLayer({
        "id": "bom-stations",
        "type": "symbol",
        "source": "stations",
        "layout": {
            "visibility": "none",
            "icon-image": 'bom-icon',
            "icon-size": 0.5
        },
        "filter": ["==", "$type", "Point"],
    });
    map.loadImage("assets/bom-station-icon.png", function(error,image){
        if (error) throw error;
        map.addImage('bom-icon', image)
    });

    // Switch to the appropriate view
    if (window.location.hash == "") {
        currentConditionsView.switchTo();
    } else if (window.location.hash.startsWith("#forecasts")) {
        forecastsView.switchTo();
    } else if (window.location.hash.startsWith("#myfarm")) {
        myfarmView.switchTo();
    }

}


// Views are implementations of this type
var currentView = null;
const viewType = {
    navitem: "",
    constructed: false,
    active: false,

    switchTo() {
        var oldView = currentView;
        currentView = this;
        this.active = true;

        if (!this.constructed) {
            this.construct();
            this.constructed = true;
        }

        if (oldView == this) {
            this.reenter(); // reinitialise
            return;
        } 
        if (oldView != null) {
            // Clean up the previous view
            oldView.active = false;
            oldView.exit(); 
        }

        // Set which navbar item is active
        $(this.navitem).addClass("active").siblings().removeClass("active");
        
        // Enter the view
        this.enter();
    },

    // Functions that views must implement
    construct() {},
    enter() {},
    reenter() {},
    exit() {}
};

// A version of map.addSource that provides a callback when the source has been loaded
function addSource(map, setname, source, callback) {
    var onSetsLoaded = function(e) {
        if (e.isSourceLoaded) {
            console.log(setname, "Triggered", e);
        }
        if (e.isSourceLoaded && e.source.type == source.type && e.source.data == source.data) {
            // Unsubscribe from the event
            map.off('sourcedata', onSetsLoaded);
            console.log(setname, "Unsub");
            if (callback !== undefined) {
                callback();
            }
        }
    }
    map.on('sourcedata', onSetsLoaded);
    map.addSource(setname, source);
}



///////////////////////////////////////////////////////
// Current conditions
const currentConditionsView = {
    __proto__: viewType,
    navitem: "#navitem-currentConditions",
    markers: [],

    enter() {
        $("#myfarmcontainer").addClass("footer-container-step-0");
        $("#legend").addClass("map-overlay-step-0");
        this.reenter();
    },

    reenter() {
        map.setLayoutProperty("bom-stations", "visibility", "visible");
        map.stop().fitBounds([[146.980, -19.458], [147.579, -20.332]]);  
    },

    exit() {
        map.setLayoutProperty("bom-stations", "visibility", "none");
        $("#myfarmcontainer").removeClass("footer-container-step-0");
        $("#legend").removeClass("map-overlay-step-0");
        this.markers.forEach(function(m) {
            m.remove();
        })
    }
};





///////////////////////////////////////////////////////
// Forecasts

const forecastsView = {
    __proto__: viewType,
    navitem: "#navitem-forecasts",
    currentZone: null,

    construct() {
        // Set up legend overlay
        // a list of colours and values
        cols = ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"];
        labs = ['1','5','10',"15","20","40","60","80","100","120"];
        // add in a div for each colour / label combo
        createLegend(cols,labs);

        

        // Set up hover effect on the sets 
        var hoveredSetID = null;
        map.on("mousemove", "zone-fills", function(e) {
            if (e.features.length > 0) {
                map.getCanvas().style.cursor = 'pointer';
                // unhighlight the previous set
                if (hoveredSetID) {
                    map.setFeatureState({source: "zones", id: hoveredSetID}, {hover: false});
                }
                // highlight this one
                hoveredSetID = e.features[0].id;
                map.setFeatureState({source: "zones", id: hoveredSetID}, {hover: true});
            }
        });
        map.on("mouseleave", "zone-fills", function(e) {
            if (hoveredSetID) {
                map.setFeatureState({source: "zones", id: hoveredSetID}, {hover: false});
            }
            hoveredSetID = null;
            map.getCanvas().style.cursor = '';
        });

        // add an on click option to forecast zones that bring up some extra data in the footer
        map.on("click", function(e) {
            if (!forecastsView.active) {
                return;
            }
            // Detect if the click is on a set or not
            var features = map.queryRenderedFeatures(e.point, { layers: ['zone-fills'] });
            if (features.length == 0 || features[0].id == forecastsView.currentZone) {
                // Clicked out of a block
                if (forecastsView.currentZone) {
                    map.setFeatureState({source: "zones", id: forecastsView.currentZone}, {active: false});
                    forecastsView.currentZone = null;
                }
                $("#myfarmcontainer").addClass("footer-container-step-1").removeClass("footer-container-step-2");
                $("#mainmap").addClass("map-step-1").removeClass("map-step-2");
                map.resize();
            } else {
                // Focus on this block

                // Draw a border around the active block
                if (forecastsView.currentZone) {
                    map.setFeatureState({source: "zones", id: forecastsView.currentZone}, {active: false});
                }
                forecastsView.currentZone = features[0].id;
                map.setFeatureState({source: "zones", id: forecastsView.currentZone}, {active: true});           
                
                // Adjust the footer size
                $("#myfarmcontainer").removeClass("footer-container-step-1").addClass("footer-container-step-2");
                $("#mainmap").removeClass("map-step-1").addClass("map-step-2");
                map.resize();

                // setup the block summary
                var matchingFeatures = zones.data.features.filter(function (f) { return f.id == forecastsView.currentZone });    
                 
                var description = document.createElement('div');
                description.className = "forecastSet";
                description.style.width = '100%';
                description.style.height = '9rem';
                description.style['overflow-x'] = "auto";
                description.style.display  = 'flex';
                description.style['white-space'] = 'nowrap';
                for(foreday=7;foreday<zones.metadata.dates.length;foreday++){
                    tempday = document.createElement('div');
                    tempday.id = foreday-7;
                    tempday.className = "forecast-day";
                    tempday.innerHTML = `<span>${dateFormat(zones.metadata.dates[foreday],"dddd dd/mm")}</span><br>
                    <span><img src="assets/temp_low.png" class="inline-icon">${matchingFeatures[0].properties.MinT_SFC[foreday]}<img src="assets/temp.png" class="inline-icon">${matchingFeatures[0].properties.MaxT_SFC[foreday]}</span><br>
                    <span><img src="assets/rain.png" class="inline-icon">${matchingFeatures[0].properties.DailyPrecip75Pct_SFC[foreday]} - ${matchingFeatures[0].properties.DailyPrecip25Pct_SFC[foreday]} mm</span><br>
                    <span><img src="assets/crop2.png" class="inline-icon">${matchingFeatures[0].properties.DailyCWU_SFC[foreday]} mm</span>`;
                    description.appendChild(tempday);
                };
                document.getElementById("block-heading").innerHTML=`${matchingFeatures[0].properties.cluster}`;
                document.getElementById("myfarm-summary").innerHTML = description.outerHTML;

                // Draw the plot
                
                if (matchingFeatures.length == 1) {
                    var plotX = zones.metadata.dates;
            
                    Plotly.newPlot("myfarm-plot", 
                        [
                            { // upper bound of rain forecast 'historical'
                                y: matchingFeatures[0].properties.DailyPrecip25Pct_SFC_oneday.map((x)=> {if(x <= -999){return null}else{return x}}),
                                x: plotX,
                                name: 'pred (mm)',
                                type: 'bar',
                                marker: {color: '#00FF00'}
                            },
                            { //lower bound of rain forecast 'historical'
                                y: matchingFeatures[0].properties.DailyPrecip75Pct_SFC_oneday.map((x)=> {if(x <= -999){return null}else{return x}}),
                                x: plotX,
                                width: 1,
                                name: '',
                                hoverlabel: {bgcolor:'#00FF00'},
                                type: 'bar',
                                marker: {color: 'white'},
                                showlegend: false
                            },
                            { // upper bound of rain forecast '
                                y: matchingFeatures[0].properties.DailyPrecip25Pct_SFC.map((x)=> {if(x <= -999){return null}else{return x}}),
                                x: plotX,
                                name: 'pred (mm)',
                                type: 'bar',
                                marker: {color: '#00FF00'}
                            },
                            { //lower bound of rain forecast
                                y: matchingFeatures[0].properties.DailyPrecip75Pct_SFC_oneday.map((x)=> {if(x <= -999){return null}else{return x}}),
                                x: plotX,
                                width: 1,
                                name: '',
                                hoverlabel: {bgcolor:'#00FF00'},
                                type: 'bar',
                                marker: {color: 'white'},
                                showlegend: false
                            },
                            { // 'observed' rainfall from silo
                                y: matchingFeatures[0].properties.daily_rain.map((x)=> {if(x <= -999){return null}else{return x}}),
                                x: plotX,
                                name: 'observed',
                                type: 'scatter',
                                marker: {color: '#000000'},
                                showlegend: false
                            }
                        ],
                        {
                            yaxis: {
                                title: 'Daily Rainfall  (mm)'
                            },
                            margin: {
                                t: 0,
                                b: 30,
                                l: 55,
                                r: 55
                            },
                            showlegend: false,
                            legend:{
                                orientation: 'h',
                            }
                    },
                    {
                        displayModeBar: false,
                        responsive: true
                        });
                } else {
                    // Don't have SWD data to plot.
                    $("#myfarm-plot").empty().text("Cannot display SWD data for this block because it was not found in the database.");
                }

            }
        });

    },

    

    enter() {
        map.setLayoutProperty("zone-borders", "visibility", "visible");
        map.setLayoutProperty("zone-fills", "visibility", "visible");
        $("#myfarmcontainer").addClass("footer-container-step-1");
        $("#mainmap").addClass("map-step-1");
        
        this.reenter();
    },

    reenter() {
        // Already on this view. Reset the map view but do nothing else.
        map.stop().fitBounds([[146.980, -19.458], [147.579, -20.332]]);
        //make sure the zone-borders layer is visible. This is to do with changing the background layer
        map.setLayoutProperty("zone-borders", "visibility", "visible");
        map.setLayoutProperty("zone-fills", "visibility", "visible");
        $("#legend").removeClass("map-overlay-step-0");
        $("#legend").addClass("map-overlay-step-1");
        document.getElementById('forecastplotvar').style.display = "block";
        document.getElementById('farmplotvar').style.display = "none";
        getforecastVar(document.getElementById("forecastplotvar"));
        // add a date picker
        document.getElementById('myfarm-date-range').innerHTML='emptyit';
        document.getElementById('myfarm-date-label').innerHTML='';
        createDateSelector(
            zones.metadata.dates,
            'myfarm-date-range',dateFormat(new Date(),'yyyy-mm-dd'),
            zones.metadata.dates[13],"2020-10-20"
        );
        document.getElementById('fowarddate').onclick = forecastdatePlusOne;
        document.getElementById('backdate').onclick = forecastdateMinusOne;
    },

    exit() {
        map.setLayoutProperty("zone-borders", "visibility", "none");
        map.setLayoutProperty("zone-fills", "visibility", "none");
        $("#myfarmcontainer").removeClass("footer-container-step-1").removeClass("footer-container-step-2");
        $("#legend").removeClass("map-overlay-step-1");
        $("#mainmap").removeClass("map-step-1").removeClass("map-step-2");
        $("#legend").removeClass("map-overlay-step-1");
        document.getElementById('forecastplotvar').style.display = "none";
    }
}




///////////////////////////////////////////////////////
// My Farm

const myfarmView = {
    __proto__: viewType,
    navitem: "#navitem-myfarm",
    currentBlock: null,
    
    construct() {
        // Set up legend overlay
        // a list of colours and values
        cols = ["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"];
        labs = ['-100','-80','-60',"-40","-20","0","20"];
        // add in a div for each colour / label combo
        createLegend(cols,labs);
        
        // Set up hover effect on the sets 
        var hoveredSetID = null;
        map.on("mousemove", "set-fills", function(e) {
            if (e.features.length > 0) {
                map.getCanvas().style.cursor = 'pointer';
                // unhighlight the previous set
                if (hoveredSetID) {
                    map.setFeatureState({source: "sets", id: hoveredSetID}, {hover: false});
                }
                // highlight this one
                hoveredSetID = e.features[0].id;
                map.setFeatureState({source: "sets", id: hoveredSetID}, {hover: true});
            }
        });
        map.on("mouseleave", "set-fills", function(e) {
            if (hoveredSetID) {
                map.setFeatureState({source: "sets", id: hoveredSetID}, {hover: false});
            }
            hoveredSetID = null;
            map.getCanvas().style.cursor = '';
        });
        // add an on click option to myfarm blocks that bring up some extra data in the footer
        map.on("click", function(e) {
            if (!myfarmView.active) {
                return;
            }
            // Detect if the click is on a set or not
            var features = map.queryRenderedFeatures(e.point, { layers: ['set-fills'] });
            if (features.length == 0 || features[0].id == myfarmView.currentBlock) {
                // Clicked out of a block
                if (myfarmView.currentBlock) {
                    map.setFeatureState({source: "sets", id: myfarmView.currentBlock}, {active: false});
                    myfarmView.currentBlock = null;
                }
                $("#myfarmcontainer").addClass("footer-container-step-1").removeClass("footer-container-step-2");
                $("#mainmap").addClass("map-step-1").removeClass("map-step-2");
                map.resize();
            } else {
                // Focus on this block

                // Draw a border around the active block
                if (myfarmView.currentBlock) {
                    map.setFeatureState({source: "sets", id: myfarmView.currentBlock}, {active: false});
                }
                myfarmView.currentBlock = features[0].id;
                map.setFeatureState({source: "sets", id: myfarmView.currentBlock}, {active: true});           
                
                // Adjust the footer size
                $("#myfarmcontainer").removeClass("footer-container-step-1").addClass("footer-container-step-2");
                $("#mainmap").removeClass("map-step-1").addClass("map-step-2");
                map.resize();

                // setup the block summary
                var matchingFeatures = sets.data.features.filter(function (f) { return f.id == myfarmView.currentBlock });

                var swdvalue;
                var etvalue;
                var lastigtext;
                var nextigtext;
                // set swd and et to last 'observed' value
                swdvalue = matchingFeatures[0].properties.SoilDef_hist[6].toFixed(2);
                etvalue = matchingFeatures[0].properties.ET_hist[6].toFixed(2);
                
                var lastigindex = Math.max(...matchingFeatures[0].properties.NetApp_hist.map((value,index) => {if(value > 0){return index}else{return -1}}));
                var nextigindex = matchingFeatures[0].properties.NetApp_zero.findIndex((x) => x > 0);
                if(lastigindex < 0){
                    lastigtext = "no irrigation last week";
                }else{
                    lastigtext = `${matchingFeatures[0].properties.NetApp_hist[lastigindex].toFixed(2)} mm on  ${dateFormat(matchingFeatures[0].properties.GraphDate[lastigindex],"dd mmm")}`
                };
                if(nextigindex < 0){
                    nextigtext = "no irrigation scheduled";
                }else{
                    nextigtext = `${matchingFeatures[0].properties.NetApp_zero[nextigindex].toFixed(2)} mm on  ${dateFormat(matchingFeatures[0].properties.GraphDate[nextigindex],"dd mmm")}`
                };
    
                var description =
                `<div title="BlockId">SWD and ET for end of day yesterday:</div>` +
                `<div title="SoilDef">    SWD: ${swdvalue} (mm)</div>` +
                `<div title="ET">    ET: ${etvalue} (mm)</div>` +
                `<div title="LastIrr">Last Irrigation: ${lastigtext}</div>` +
                `<div title="NextIrr">Next Irrigation: ${nextigtext}</div>`;

                document.getElementById("block-heading").innerHTML=`${matchingFeatures[0].properties.FarmName}: ${matchingFeatures[0].properties.FieldName}`;
                document.getElementById("myfarm-summary").innerHTML = description;

                // Draw the plot
                
                if (matchingFeatures.length == 1) {
                    var plotX = matchingFeatures[0].properties["GraphDate"];
            
                    Plotly.newPlot("myfarm-plot", 
                        [{x: plotX,
                          y: matchingFeatures[0].properties["SoilDef_hist"],
                          type: 'scatter',
                          name: 'current',
                          yaxis: 'y',
                          marker: {color: '#000000'}
                         },
                         {x: plotX,
                          y: matchingFeatures[0].properties["SoilDef_zero"],
                          type: 'scatter',
                          name: 'ZeroRainfall',
                          yaxis: 'y',
                          marker: {color: '#0000FF'}
                         },
                        {x: plotX,
                         y: matchingFeatures[0].properties["NetApp_hist"],
                         type: 'bar',
                         name: 'irrig_applied',
                         yaxis: 'y2',
                        marker: {color: '#000000'}
                         },
                         {x: plotX,
                          y: matchingFeatures[0].properties["NetApp_zero"],
                          type: 'bar',
                          name: 'irrig_schedule',
                          yaxis: 'y2',
                         marker: {color: '#0000FF'}
                         }],
                        {
                            yaxis: {
                                title: 'SWD (mm)'
                            },
                            yaxis2: {
                                overlaying: 'y',
                                side: 'right',
                                title: 'Irr (mm)'
                            },
                            margin: {
                                t: 0,
                                b: 30,
                                l: 55,
                                r: 55
                            },
                            showlegend: false,
                            legend:{
                                orientation: 'h',
                            }
                    },
                    {
                        displayModeBar: false,
                        responsive: true
                        });
                } else {
                    // Don't have SWD data to plot.
                    $("#myfarm-plot").empty().text("Cannot display SWD data for this block because it was not found in the database.");
                }
            }
        })

    },

    enter() {
        $("#myfarmcontainer").addClass("footer-container-step-1");
        $("#legend").removeClass("map-overlay-step-0");
        $("#legend").addClass("map-overlay-step-1");
        $("#mainmap").addClass("map-step-1");
        map.resize();

        map.setLayoutProperty("set-fills", "visibility", "visible");
        map.setLayoutProperty("set-borders", "visibility", "visible");
        map.setLayoutProperty("zone-borders", "visibility", "none");
        this.reenter();
    },

    reenter() {
        // Already on this view. Reset the map view.
        bounds = new mapboxgl.LngLatBounds();
        for(feature of sets.data.features){
            var coords = feature.geometry.coordinates;
            for(coord of coords){
                bounds.extend(coord);
            }
        };            
        map.stop().fitBounds(bounds,{padding:100});
        // make sure the set-fills and set-borders are visible
        map.setLayoutProperty("set-fills", "visibility", "visible");
        map.setLayoutProperty("set-borders", "visibility", "visible");
        $("#legend").removeClass("map-overlay-step-0");
        $("#legend").addClass("map-overlay-step-1");
        getfarmVar(document.getElementById("farmplotvar"));
        document.getElementById('farmplotvar').style.display = "block";
        document.getElementById('forecastplotvar').style.display = "none";

        // add a date picker
        document.getElementById('myfarm-date-range').innerHTML='emptyit';
        document.getElementById('myfarm-date-label').innerHTML='';
        createDateSelector(
            zones.metadata.dates,
            'myfarm-date-range',dateFormat(new Date(),'yyyy-mm-dd'),
            zones.metadata.dates[13],"2020-10-20"
        );
        document.getElementById('fowarddate').onclick = farmdatePlusOne;
        document.getElementById('backdate').onclick = farmdateMinusOne;


    },

    exit() {
        map.setLayoutProperty("set-fills", "visibility", "none");
        map.setLayoutProperty("set-borders", "visibility", "none");
        $("#myfarmcontainer").removeClass("footer-container-step-1").removeClass("footer-container-step-2");
        $("#mainmap").removeClass("map-step-1").removeClass("map-step-2");
        $("#legend").removeClass("map-overlay-step-1");
        document.getElementById('farmplotvar').style.display = "none";
        map.resize();

    }
}

