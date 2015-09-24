# Austin Parks Equity App

### This is a civic app that aims to help visualize how Austin's park resources are distributed throughout the City of Austin.
<<<<<<< HEAD

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

_gulp is used to build and run the app. Before you can serve the app locally, you need to install gulp cli:_

	$ npm install -g gulp

**3. [compass](http://compass-style.org/) is required**

_compass is a css authoring framework that is used to generate css used by the app. Follow the [install instructions](http://compass-style.org/install/) on the compass site._

**4. install npm dependencies**

Install the npm dependencies:

	$ npm install

**5. run the development server**

To run the local server and see the app in your browser:

	$ gulp

Gulp serves the app at `http://localhost:8080`.


=======
>>>>>>> master

###Status: _under development_

###Related News:

- [District 4 residents want more parks, connectivity - June 3, 2015](http://communityimpact.com/district-4-residents-want-more-parks-connectivity/)
- [Council Member Houston sees disparity in treatment of parks - May 20, 2015](http://www.austinmonitor.com/stories/2015/05/houston-sees-disparity-treatment-parks/)
- [District 4 community meeting on parks - April 30, 2015](http://us8.campaign-archive1.com/?u=6fe419e1bea63f17bb6c8842d&id=13e7c71daa)
- [North Austin green space becomes a priority for council - March 25, 2015](http://impactnews.com/austin-metro/northwest-austin/north-austin-green-space-becomes-a-priority-for-council)

See our progress: [Live Demo](http://open-austin.github.io/austin-park-equity/)

<<<<<<< HEAD
- **Download "City of Austin Parks" GIS data** from City of Austin Data Portal.(https://data.austintexas.gov/dataset/City-Of-Austin-Parks/99qw-4ixs).
- **Convert Shapefile to [GeoJSON](https://github.com/mateoclarke/Austin_Parks_Acreage/blob/master/data/city_of_austin_parks.geojson)** using GDAL. I referenced [this blog post](http://ben.balter.com/2013/06/26/how-to-convert-shapefiles-to-geojson-for-use-on-github/) from Ben Balter for help.
=======
##Credits
>>>>>>> master

- **Maintainer**: [@mateoclarke](https://github.com/mateoclarke) - dev
- [@kyoder](https://github.com/kyoder) - GIS Data Analysis
- [@wilsaj](https://github.com/wilsaj) - GIS & dev
- [@fremn](https://github.com/fremn) - dev
- [@luqmaan](https://github.com/luqmaan) - dev
- [@mattybow](https://github.com/mattybow) - dev
- [@johntryee](https://github.com/johntyree) - dev

<<<<<<< HEAD
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

## Unlicense:
Released to the public domain under the [Unlicense](http://unlicense.org/) by [Open Austin](http://open-austin.org), 2015.

=======
## Running Code Locally:

**1. [npm](https://www.npmjs.com/) is required**

_npm is Node's package manager. You can install Node at [their site](https://nodejs.org/download/) or with a command like `brew install node` if you use Homebrew._

**2. [gulp](http://gulpjs.com/) is required**

_gulp is used to build and run the app. Before you can serve the app locally, you need to install gulp cli:_

	$ npm install -g gulp

**3. [webpack](https://webpack.github.io/docs/tutorials/getting-started/) is required**
_webpack is used to bundle assets_

	$ npm install -g webpack

To bundle assets:

 	$ webpack --watch

**4. [compass](http://compass-style.org/) is required**

_compass is a css authoring framework that is used to generate css used by the app. Follow the [install instructions](http://compass-style.org/install/) on the compass site._

**5. install npm dependencies**

Install the npm dependencies:

	$ npm install

**6. run the development server**

To run the local server and see the app in your browser:

	$ gulp

Gulp serves the app at `http://localhost:8080`.


## To (re)build data files:

The data processing workflow is (for the most part) automated with a `Makefile`
in the `data/` directory. This workflow assumes a UNIX operating system (such as
OS X or Linux). You'll also need:

- node / npm
- ruby
- ogr/gdal


To build data files, cd into the `data/` directory:

    $ cd data


And run `make`

    $ make


If you want to rebuild or update a file, just delete it and re-run make. At the
moment, not everything has been ported over to the `Makefile`, so this won't
work for all files.


## Data sources & use:
- City of Austin, Parks and Rec Dept (PARD) Data
	- [Basic Park Feature Layer via ArcGIS Server](http://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/city_of_austin_parks/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=pgeojson&token=)
		- _Also available on [data.austintexas.gov](https://data.austintexas.gov/dataset/City-Of-Austin-Parks/99qw-4ixs)_
		- This data is used across the app to produce park shapes.
	- [Park Amenity Points](https://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/STRUCTURE_pard_amenity_points/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=pgeojson&token=)
		- This data is used to calculate whether a park is "undeveloped" or "developed".
	- [Park Facility Points](https://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/STRUCTURE_pard_facility_points/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=pgeojson&token=)
		- This data is used to calculate whether a park is "undeveloped" or "developed".  
	- [Park Trails](https://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/pard_trails_nrpa/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=pgeojson&token=)
- [Open Street Map](https://www.openstreetmap.org/) Park Data:
	- We use the [Overpass API](http://wiki.openstreetmap.org/wiki/Overpass_API) via the ["query-overpass" plugin](https://github.com/perliedman/query-overpass) to extract data. Here's [the commit that added OSM data](https://github.com/open-austin/austin-park-equity/commit/a89bd02fce6170beac8dcf11c7a3f3479a71d047) if you're curious how.
	- We use this data to expose privately owned but publically accesible parks that PARD doesn't maintain.
- Census.gov Data
	-  [District Demographic Data](https://www.austintexas.gov/page/district-demographics) via City of Austin Demographer.
	-  [CitySDK API](http://uscensusbureau.github.io/citysdk/)
		- We use this data to show park need and compare districts.  	


## Architectural Decisions & Known Issues:
- Our javascript files are messy. Based on the way this project grew from one map to many, we are currently making a seperate js file for each html page. This is bad and should eventually be fixed.
- For the park access heatmap, we ran a GIS process in ArcGIS. This static heatmap layer isn't response to park layers being toggled on and off. We'll probably use CartoDB to host these heatmaps in the future and rely on their PostGIS servers to create simplified buffers vs the cost-distance analysis heatmap we are currently working with.
- **Question about why or how we did something? [Create an issue!](https://github.com/open-austin/austin-park-equity/issues/new)**

## Unlicense:
Released to the public domain under the [Unlicense](http://unlicense.org/) by [Open Austin](http://open-austin.org), 2015.
>>>>>>> master
