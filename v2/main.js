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
fetchJSON("weather-stations.geojson", function(data) {
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
        this.markers = stations.data.features.map(function(stn) {
            var element = $.parseHTML( 
                '<div class="conditions-marker">' +
                '<div>Ayr DPI Stn</div>' +
                '<div title="Current temperature"><img src="assets/temp.png" class="inline-icon"> 24.5 &deg;C</div>' +
                '<div title="Wind direction and speed"><img src="assets/wind_e.png" class="inline-icon" title="Wind from the east"> 15 km/h</div>' +
                '<div title="Rain since 9am"><img src="assets/rain.png" class="inline-icon"> 0 mm</div>' +
                '<div title="Full canopy crop water usage"><img src="assets/crop.png" class="inline-icon" title="Full canopy crop water usage"> 5 mm/day</div>' +
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
        map.stop().fitBounds([[146.980, -19.458], [147.579, -20.332]]);  
    },

    exit() {
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

