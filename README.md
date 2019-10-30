# CSSIP: OptiCane web app dev page

This is the development page for the Opticane web-app developed by CSSIP. CSSIP aims to provide improved irrigation advice to sugarcane growers in the Burdekin region of Queensland, Australia. This is to be achieved throught the use of a sugarcane crop model and downscaled short (1 - 7 days) and medium ( 2 weeks to 6 months) weather forecasts. Currently there are three main pages under active development:

1. Current conditions  
   Currently uses BoM station observations updated every half hour  
2. Forecasts  
   Currently uses BoM ADFD forecast data. This includes daily rainfall parameters as well as temperature and wind speed data  
3. MyFarm  
   An irrigweb login will be required to access the MyFarm data as this page makes use of the irrigweb online crop model. This will show crop specific parameters such as soil water defict, for specific 'blocks' or 'irrigation units'.  

All basic html elements are created within the index.html file and page creation is done using the main.js, rather than have individual html files for each page.

## List of files and folders  
  
* Folders
   * assets  
      This contains svg icons used in the web-app.  
   * css  
      This contains styling css files associated with a custom CSSIP font!
   * font  
      This contains files for a custom CSSIP icon-font. It was created using a free online icon-font generator, which should be noted in here somewhere. Primarily this is for icons that we need to be treated like fonts. Currently there is a login icon and information icon embedded in this font. I would also like to add an icon for the map view button.  
   * lib  
      This contains some specific javascript packages. At the moment only the package that creates the date slider and a package for formating dates. The dateformat package I had to download and store here as the link is http not https.  
   * v1  
      This is an old version of the web-app. it is no longer used. 
* Files  
   * CNAME  
      No Idea what this is!  
   * _config.yml  
      No idea what this is!
   * config.json  
      This is a config file required by the custom font dodad. Please do not remove.  
   * createLegend.js  
      This is a sketchpad file I've been using to test some code. Usually use this when trying to functionize my awful code.
   * index.html  
      The html code for the web-app. This contains almost all webpage structure, except where I have to create it on the fly. It also contains the js package calls. Not all packages are stored in the lib folder.  
   * main.js  
      This contains the javascript to run the web-app, including switching between 'pages'. It also has a lot of custom functions that it may be neater to move to separate files.  
   * sets.geojson  
      This is a legacy testing geojson for the MyFarm page. It is no longer used.  
   * simpleserver.bat  
      This is a windows batch file used to create a simple python server for local testing.  
   * style.css  
      This is the main repository of styles.  
   * zones.geojson  
      This is a legacy testing geojson for the Forecast page. It is no longer used.  
   
