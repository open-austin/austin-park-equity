# CitySDK Austin Parks

### This is a demonstration app forked from [Austin Park Equity](http://austinparkequity.com) to give a mapping example using API open data from Census.gov.

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


## Austin Data Sources:
- City of Austin, Parks and Rec Dept (PARD) Data
	- [Basic Park Feature Layer via ArcGIS Server](http://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/city_of_austin_parks/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=pgeojson&token=)
		- _Also available on [data.austintexas.gov](https://data.austintexas.gov/dataset/City-Of-Austin-Parks/99qw-4ixs)_
		- This data is used across the app to produce park shapes.

## Global Data Sources:
- [Open Street Map](https://www.openstreetmap.org/) Park Data:
	- We use the [Overpass API](http://wiki.openstreetmap.org/wiki/Overpass_API) via the ["query-overpass" plugin](https://github.com/perliedman/query-overpass) to extract data. Here's [the commit that added OSM data](https://github.com/open-austin/austin-park-equity/commit/a89bd02fce6170beac8dcf11c7a3f3479a71d047) if you're curious how.
- Census.gov Data
	-  [CitySDK API](http://uscensusbureau.github.io/citysdk/)

## Unlicense:
Released to the public domain under the [Unlicense](http://unlicense.org/) by [Open Austin](http://open-austin.org), 2015.
