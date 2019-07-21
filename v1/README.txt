 CCSIP app attempt

Author: Justin Sexton (ish)

Description:

This is my attempt at creating an interactive app with html and javascript.

There are 4 html pages and 7 support files excluding this readme.

Due to some cross domain issues CHROME may not display the pages properly. I suggest using firefox which seems to have less issues.
THIS IS FIXED USING THE PYTHON SERVER
I've put a batch (.bat) file in this folder. running it will run py -m http.server 9876. Chrome can then be used to connect via localhost:9876


Javascript code is written into each page... It's messy and I'm not convinced it all ordered like it should be but it seems to work.

One issue I'm still struggling with is importing data. AJAX is used to load data but this means that the map can be drawn before the data is loaded. 
I had to add some control to ensure that data is read in before elements try to use it. (this is described in the climate.html. 

HTML pages:

1. Climate.html:
	climate.html is the climatology page of the app and explains the clusters. This page is what I'm using to learn to do the coding so it is the most up to date.
	This page has the best commenting and should explain how most things work. The other pages are not commented properly at the moment
	This page makes use of the 3ClusterMap.geojson, Burdekin_climate.geojson climatezonecaptions.json and cssip.css.
	Currently this page maps the climate data used in making the clusters.
	It also shows a description of the current mapped data which are stored in climatezonecaptions.json and a boxplot using plotly
	The mapped data, description and boxplot can be changed by the user. 
	Climate variables include: Rainfall, radiation, T.Max, T.Min  and ThermalTime (Thermal time currently doesn't work)
	The data can be shown for Annual (Jan - Dec), Summer (DJF), Autumn (MAM), Winter (JJA) or spring (SON).
	Note that there is currently an issue with how summer is calculated. It should be the previous december but may in fact be the current december.
	
2. index.html:
	index.html is the 'latest' weather page. Currently it just has some basic place holders based on my first attempt at the Climate page
	This page uses the Burdekin_3ClusterMap.geojson and cssip.css.
	The latest page is called index.html because by convention index.html is called first by web browsers if a specific page isn't named.

3. forecast.html:
	forecast.html is the 'forecast' weather page. Currently it just has some basic place holders based on my first attempt at the Climate page
	This page uses the Burdekin_3ClusterMap.geojson and cssip.css.
	
4. myfarm.html:
        myfarm.html is the irrigweb user page. I have updated this to give a map of 5 blocks. And a plot of 'SWD" over time.
        The data for this is 'sourced' from farmdata.json. The HTML filters the data for 'user1'. The blocks are coloured by
        SWD for the given date. The date is updated using the date slider. The date slider relies on specific strings.
        I want the plot in block overview to update when a specific block is clicked but haven't gotten there yet. 
        The code for the myfarm.html is extremely messy still. The blocks now highlight on mouseover and show the block name on click.
        More can be added to the popup if I add more info to the feature.properties (should add a popUpInfo property that has html script to format
        text). Clicking on a block now updates the plot to show the selected block. A yellow bar in the background highlights the date that is 
        selected by the date slider. 
        I don't think boxplots are the best option here but I can't figure out how to do a 'floating bar'. 
	
SUPPORT FILES

1. 3ClusterMap.geojson
	This is a 'proper' geojson and needs to be read in using a database/url connection.
	This geojson holds details for three clusters. Clusters are named but no additional info is supplied (ie. no weather or farm data).

2. Burdekin_3ClusterMap.geojson
	This is not a proper geojson. It is infact javascript that creates a variable that stores the geojson info.
	This was used because i couldn't figure out how to read in json data. Chrome has issues with reading local files (cross domain / cron issues).
	This is still used by some pages though I have a proper geojson working on the climate page.
	
3. Burdekin_climate.geojson
	This is not a proper geojson. I've still got to change it like I have with the cluster geojson.
	This was used because i couldn't figure out how to read in json data. Chrome has issues with reading local files (cross domain / cron issues).
	This is still used by the climate page.
	
4. climatezonecaptions.json
	This is proper json and needs to be read in using a connection.
	This stores a description of the clusters in terms of each climate variable (e.g. Summer Rainfall).
	Data is stored in key-value pairs.
	The Data is scripted as html with the names of zones in span arguments (e.g. <span class=zone1>Zone 1</span>). 
	This allows the custom css to colour-code specific words to match the figure and map.

5. cssip.css
	This contains the custom style info used on all pages. Some of this is very dodgy.
	I've attempted to comment on what is used for what but this style was originally stored in the html.
	As such it may not be thorougly documented.

6. myfarmdb.json
	This is not a true json but is infact a javascript code that calls a json.
        This is a big database that includes three 'users'. Each 'user' has five blocks. 
        Each block has rainfall, irrigation and swd data for 14 dates.
        The first 7 dates have 'observed' values (ensemble = 0) and every date has 20 'predictions' (ensemble = 1:20)
        I'd expect our database to have something like this. But in practice filtering for date and user would occur
        on the server side. Obviously we don't want to load the whole database in practice.
        As it is this page runs slowly.
	
7. zoneforecast.json
	This is a json array at the moment. It may be easier to convert it to a js script like myfarmdb.
	This is for use in the forecast tab, but hasn't been implemented yet.
	The 'database' has SILO daily data for each of the three clusters for a 14 day period
	The first 7 days are for use as observed data. The second 7 days are used for forecast.
	The first 7 days is actual SILO data. It is created by averaging the SILO gridded data for the three clusters.
	The second 7 days is just the first 7 days repeated and I should have removed the observed data but didn't.
	Unlike the myfarmdb I did not include 'ensembles'. This proved to be a hassel with the myfarmdb.
	Instead. 'forecast' data is given as a max and min for each variable e.g. 'Rain_max'. In practice this will be a lot 
	easier to plot. Although I'm not sure what the zones wil be coloured. (maybe by max as a 'worst case scenario'?).
	In practice I think this would be the format to send the myfarm and forecast data into the web address. With the 
	actual data being a sql database (which would look more like the current myfarmdb) and the call to the database extracting 
	and summarizing the data into something like this. 

8. favicon.ico / cssipicon.png
	this was supposed to be an icon to use in the banner. Only the png is used and only on the climate page.

9. canebanner1.jpg
	This is a jpg made from a photo I (Justin) own. It is used to make a background for the banner or header of the app.
	It is only used on the climate page and doesn't look particularly great.
	

	