///////////////////////////////////////////////////////
// Generic code

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

// Generate wind direction / rotation

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
}



///////////////////////////////////////////////////////
// Load the map
var map_loaded = false;
var zones;
var sets;
var stations;
mapboxgl.accessToken = 'pk.eyJ1IjoiYnJvbnNvbnBoaWxpcHBhIiwiYSI6ImNqeGp1cWFzNjA3dGEzbnFmMGRvcTZjaXkifQ.gKYwAr9h6yprnsOG3LiU-w';
const map = new mapboxgl.Map({
    container: 'mainmap',
    style: 'mapbox://styles/bronsonphilippa/cjy9int3m0kdx1cqjiay34tqt',
    center: [147.420,-19.800],
    zoom: 10
});
map.on('load', function() {
    // add bom-station ion to map
    map.loadImage("assets/bom-station-icon.png", function(error,image){
        if (error) throw error;
        map.addImage('bom-icon', image)
    });
    map_loaded = true;
    finishLoading();
});
fetchJSON("zones.geojson", function(data) {
    var metadata = data.metadata;
    delete data.metadata;
    zones = {metadata: metadata, data: data};
    finishLoading();
});
fetchJSON("sets.geojson", function(data) {
    var metadata = data.metadata;
    delete data.metadata;
    sets = {metadata: metadata, data: data};
    finishLoading();
});
// fetch BOM observations geojson from Azure blob storage
// fetchJSON("weather-stations.geojson", function(data) {
fetchJSON("https://cssipdata.blob.core.windows.net/bom-observed/Observations.geojson", function(data) {
    var metadata = data.metadata;
    delete data.metadata;
    stations = {metadata: metadata, data: data};
    finishLoading();
});

// When a click occurs on a feature in the bom-stations layer, open a popup at the
// location of the feature, with station name, last updated time and latest temp, rainfall and wind.

map.on('click', 'bom-stations', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
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


function finishLoading() {
    if (!map_loaded || zones === undefined || sets == undefined || stations == undefined) {
        return;
    }

    // Load zone data and add it to the map
    map.addSource("zones", {"type": "geojson", "data": zones.data});
    map.addLayer({
        "id": "zone-fills",
        "type": "fill",
        "source": "zones",
        "filter": ["has", "zone"],
        "layout": {
            "visibility": "none"
        },
        "paint": {
          "fill-color": [
            "match",
            ["get", "zone"],
            1, "#93EBFF",
            2, "#FFD6D6",
            3, "#CCF990",
            "#ffffff"
          ],
          "fill-opacity": 0.6
        }
      }, "landcover");

    // Load set data
    map.addSource("sets", {"type": "geojson", "data": sets.data});
    var startDate = sets.metadata.dates[0]; // todo use today's date instead
    map.addLayer({
        "id": "set-fills",
        "type": "fill",
        "source": "sets",
        "filter": ["has", "set"],
        "layout": {
            "visibility": "none"
        },
        "paint": {
            "fill-color": [
                "let", "swd_date", ["concat", "swd_", ["string", ["feature-state", "displayDate"], startDate]],

                ["interpolate",
                    ["linear"],
                    ["number", ["get", ["var", "swd_date"]], -1000],
                    -1000, "rgb(220, 220, 220)",
                    -30, "rgb(220, 0, 0)",
                    0, "rgb(0, 220, 0)"
                ]
            ],
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
        "filter": ["has", "set"],
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

    // Switch to the appropriate view
    if (window.location.hash == "") {
        currentConditionsView.switchTo();
    } else if (window.location.hash.startsWith("#forecasts")) {
        forecastsView.switchTo();
    } else if (window.location.hash.startsWith("#myfarm")) {
        myfarmView.switchTo();
    }

    // 
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
        this.reenter();
    },

    reenter() {
        // added a change to the properties to show the bom-stations layer
        // the markers have been updated to use actual data but have been commented out at the moment
        map.setLayoutProperty("bom-stations", "visibility", "visible");
        /* this.markers = stations.data.features.map(function(stn) {
            var dir = formatWindDirection(null,JSON.parse(e.features[0].properties.wind_dir)[JSON.parse(e.features[0].properties.wind_dir).length-1],JSON.parse(e.features[0].properties.wind_spd_kmh)[JSON.parse(e.features[0].properties.wind_spd_kmh).length-1]);
            var windicon;
            if(dir.direction==="CALM"){windicon = "asset/wind_CALM.png"} else {windicon = "assets/wind_S.png"};
            var element = $.parseHTML( 
                '<div class="conditions-marker">' +
        `<div title="site">${stn.properties.name}</div>` +
        `<div title="${stn.properties.last_issued}">${stn.properties.last_issued.slice(10,22)}</div>` +
        `<div title="Current temperature"><img src="assets/temp.png" class="inline-icon">
        ${stn.properties.apparent_t[stn.properties.apparent_t.length-1]}&deg;C</div>` +
        //`<div title="Wind direction and speed"><img src="assets/wind_${JSON.parse(e.features[0].properties.wind_dir)[JSON.parse(e.features[0].properties.wind_dir).length-1]}.png" class="inline-icon" title="Wind from the east">
        `<div title="Wind direction and speed"><img src=${windicon} class="inline-icon" style="transform:rotate(${dir.rotation.toFixed()}deg);" title="Wind from the east">
        ${dir.speed} km/h
        ${dir.direction}</div>` +
        `<div title="Rain since 9am"><img src="assets/rain.png" class="inline-icon">
        ${stn.properties.rain_trace[stn.properties.rain_trace.length-1]} mm</div>` +
        '</div>',
                document);
            return new mapboxgl.Marker(
                element[0],
                {
                    anchor: 'bottom'
                })
                .setLngLat(stn.geometry.coordinates)
                .addTo(map);
        });
        */
        map.stop().fitBounds([[146.980, -19.458], [147.579, -20.332]]);  
    },

    exit() {
        // turn the bom-stations layer of on exit
        map.setLayoutProperty("bom-stations", "visibility", "none");
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

    enter() {
        map.setLayoutProperty("zone-fills", "visibility", "visible");
        this.reenter();
    },

    reenter() {
        // Already on this view. Reset the map view but do nothing else.
        map.stop().fitBounds([[146.980, -19.458], [147.579, -20.332]]);  
    },

    exit() {
        map.setLayoutProperty("zone-fills", "visibility", "none");
    }
}



///////////////////////////////////////////////////////
// My Farm

const myfarmView = {
    __proto__: viewType,
    navitem: "#navitem-myfarm",
    currentBlock: null,
    
    construct() {
        // Set up date slider
        var dateSlider = document.getElementById('myfarm-date-range');
        var formattedDates = sets.metadata.dates.map(function(d) {
            return d.substring(6, 8) + "/" + d.substring(4, 6) + "/" + d.substring(0, 4);
        });
        var shortFormattedDates = sets.metadata.dates.map(function(d) {
            return d.substring(6, 8) + "/" + d.substring(4, 6);
        });
        var maxIndex = sets.metadata.dates.length-1;
        noUiSlider.create(dateSlider, {
            range: {
                min: 0,
                max: maxIndex
            },
            step: 1,
            start: Math.round(maxIndex/2),
            pips: {
            mode: 'steps',
            filter: function(value, type) {
                if (document.documentElement.clientWidth < 576) {
                if (value == 0 || value == Math.round(maxIndex/2) || value == maxIndex) {
                    return 1;
                } else {
                    return -1;
                }
                } else {
                if (value % 1 == 0) {
                    return 1;
                } else {
                    return -1;
                }
                }
            },
            format: {
                to: function(value) {
                return shortFormattedDates[value];
                }
            }
            },
            format: {
            to: function (value) {
                return value;
            },
            from: function (value) {
                return value;
            }
            }
        });
        dateSlider.noUiSlider.on('update', function(value, handle) {
            document.getElementById("myfarm-date-label").innerHTML = "Date: " + formattedDates[value[0]];
            var blockIDs = sets.data.features.map(function (f) { return f.id });
            blockIDs.forEach(function(blockid) {
                map.setFeatureState({source: 'sets', id: blockid}, { displayDate: sets.metadata.dates[value[0]] });
            });
        });

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

                // Draw the plot
                var plotX = sets.metadata.dates.map(function(d) {
                    return d.substring(0, 4) + "-" + d.substring(4, 6) + "-" + d.substring(6, 8);
                });
                var matchingFeatures = sets.data.features.filter(function (f) { return f.id == myfarmView.currentBlock });
                if (matchingFeatures.length == 1) {
                    var plotY = sets.metadata.dates.map(function(d) {
                        return matchingFeatures[0].properties["swd_" + d];
                    });
                    Plotly.newPlot("myfarm-plot", 
                        [{x: plotX, y: plotY, type: 'scatter'}],
                        {
                            yaxis: {
                                title: 'SWD (mm)'
                            },
                            margin: {
                                t: 0,
                                b: 30,
                                l: 55,
                                r: 5
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
        $("#mainmap").addClass("map-step-1");
        map.resize();

        map.setLayoutProperty("set-fills", "visibility", "visible");
        map.setLayoutProperty("set-borders", "visibility", "visible");
        map.setLayoutProperty("zone-fills", "visibility", "none");

        this.reenter();
    },

    reenter() {
        // Already on this view. Reset the map view.
        map.stop().fitBounds([[147.2010, -19.7342], [147.2218, -19.7539]]);
    },

    exit() {
        map.setLayoutProperty("set-fills", "visibility", "none");
        map.setLayoutProperty("set-borders", "visibility", "none");
        $("#myfarmcontainer").removeClass("footer-container-step-1").removeClass("footer-container-step-2");
        $("#mainmap").removeClass("map-step-1").removeClass("map-step-2");
        map.resize();

    }
}
