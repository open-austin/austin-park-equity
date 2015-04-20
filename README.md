# Austin Parks Acreage Data App

This is a civic app that aims to help visualize how Austin's park resources are distributed throughout the City of Austin.

## Methodology:

### 1. Clean & Convert Raw Parks Acreage Data

- **Recieve raw data** via Councilman Casar's Director of Policy. ([raw .xls file](https://github.com/mateoclarke/Austin_Parks_Acreage/blob/master/data/Crrent%20Park%20Registry_Acreage.Location.Zip.Name.xls))
- **Refine data** by adding Lat & Long from "PARK ADDRESS SERVICE" column using [Geo](https://github.com/mapbox/geo-googledocs/) for Google Spreadsheets. Create "Park Type" column and merge data from 5 given sheets into one table.
- *Where Geo failed to find Lat/Long from Address, use [Get Lat Lon](http://dbsgeo.com/latlon/) web service. 14 (out of 148) Parks Locations required this manually reference after Geo failed.*
- *Where still uncertain with Get Lat Lon, use Google Maps by searching "PARK NAME" field.*
- **Export to [GeoJSON file] (https://github.com/mateoclarke/Austin_Parks_Acreage/blob/master/data/austinParksAcreageData.geojson)** via [Geo](https://github.com/mapbox/geo-googledocs/) tool.

### 2. Find & Convert Park GIS Data to GeoJSON

- **Download "City of Austin Parks" GIS data** from City of Austin GIS page.(ftp://ftp.ci.austin.tx.us/GIS-Data/Regional/coa_gis.html).
- **Convert Shapefile to [GeoJSON](https://github.com/mateoclarke/Austin_Parks_Acreage/blob/master/data/city_of_austin_parks.geojson)** using GDAL. I referenced [this blog post](http://ben.balter.com/2013/06/26/how-to-convert-shapefiles-to-geojson-for-use-on-github/) from Ben Balter for help.

### 3. Add District Shapefiles from a [past project](http://mateoclarke.github.io/311vs10One/)

### 4. Set Up Web Files
	
	$ npm init

	$ npm install gulp gulp-util gulp-compass gulp-connect gulp-gh-pages --save-dev