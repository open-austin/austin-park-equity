# Austin Parks Acreage Data App

### This is a civic app that aims to help visualize how Austin's park resources are distributed throughout the City of Austin.

###Status: _under development_

###Related News:

- [District 4 residents want more parks, connectivity - June 3, 2015](http://communityimpact.com/district-4-residents-want-more-parks-connectivity/)
- [Council Member Houston sees disparity in treatment of parks - May 20, 2015](http://www.austinmonitor.com/stories/2015/05/houston-sees-disparity-treatment-parks/)
- [District 4 community meeting on parks - April 30, 2015](http://us8.campaign-archive1.com/?u=6fe419e1bea63f17bb6c8842d&id=13e7c71daa)
- [North Austin green space becomes a priority for council - March 25, 2015](http://impactnews.com/austin-metro/northwest-austin/north-austin-green-space-becomes-a-priority-for-council)

See our progress: [Live Demo](http://open-austin.github.io/Austin_Parks_Acreage/)
See our notes on [Hackpad](https://openaustin.hackpad.com/Austin-Parks-Equity-H1aHh4ggGaQ)

##Credits

- [@mateoclarke](https://github.com/mateoclarke) - "Project Champion"/dev
- [@kyoder](https://github.com/kyoder) - GIS Data Analysis
- [@fremn](https://github.com/fremn) - dev
- [@luqmaan](https://github.com/luqmaan) - dev
- [@mattybow](https://github.com/mattybow) - dev
- [@johntryee](https://github.com/johntyree) - dev

## Running Code Locally:

**1. [npm](https://www.npmjs.com/) is required**

_npm is Node's package manager. You can install Node at [their site](https://nodejs.org/download/) or with a command like `brew install node` if you use Homebrew._

**2. [gulp](http://gulpjs.com/) is required**

Before you can serve the app locally, you need to install some gulp libraries with npm:

	$ npm install gulp gulp-util gulp-compass gulp-connect gulp-gh-pages gulp-file-include gulp-rename gulp-notify --save-dev

To run the local server and see the app in your browser:

	$ gulp

Gulp serves the app at `http://localhost:8080`.



## Methodology:

### 1. Clean & Convert Raw Parks Acreage Data

- **Recieve raw data** via Councilman Casar's Director of Policy. ([raw .xls file](https://github.com/mateoclarke/Austin_Parks_Acreage/blob/master/data/Crrent%20Park%20Registry_Acreage.Location.Zip.Name.xls))
- **Refine data** by adding Lat & Long from "PARK ADDRESS SERVICE" column using [Geo](https://github.com/mapbox/geo-googledocs/) for Google Spreadsheets. Create "Park Type" column and merge data from 5 given sheets into one table.
- *Where Geo failed to find Lat/Long from Address, use [Get Lat Lon](http://dbsgeo.com/latlon/) web service. 14 (out of 148) Parks Locations required this manually reference after Geo failed.*
- *Where still uncertain with Get Lat Lon, use Google Maps by searching "PARK NAME" field.*
- **Export to [GeoJSON file] (https://github.com/mateoclarke/Austin_Parks_Acreage/blob/master/data/austinParksAcreageData.geojson)** via [Geo](https://github.com/mapbox/geo-googledocs/) tool.

### 2. Find & Convert Park GIS Data to GeoJSON

- **Download "City of Austin Parks" GIS data** from City of Austin Data Portal.(https://data.austintexas.gov/dataset/City-Of-Austin-Parks/99qw-4ixs).
- **Convert Shapefile to [GeoJSON](https://github.com/mateoclarke/Austin_Parks_Acreage/blob/master/data/city_of_austin_parks.geojson)** using GDAL. I referenced [this blog post](http://ben.balter.com/2013/06/26/how-to-convert-shapefiles-to-geojson-for-use-on-github/) from Ben Balter for help.

### 3. Add District Shapefiles from a [past project](http://mateoclarke.github.io/311vs10One/)

## "Need Score" Methodology:
1. **Percent Population Age Under 19**
	- 0 points < 10%
	- 7 points > 40%
2. **Health Insurance Coverage**
	- 0 points > 40%
	- 7 points < 10%
3. **Ratio of Housing Buildings with 2 or less units** (_Density_)
	- 0 points > 80%
	- 7 points < 20%

**Current Max Score: 21**

## License:
needs review

