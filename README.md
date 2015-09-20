# Austin Parks Equity App

### This is a civic app that aims to help visualize how Austin's park resources are distributed throughout the City of Austin.

###Status: _under development_

###Related News:

- [District 4 residents want more parks, connectivity - June 3, 2015](http://communityimpact.com/district-4-residents-want-more-parks-connectivity/)
- [Council Member Houston sees disparity in treatment of parks - May 20, 2015](http://www.austinmonitor.com/stories/2015/05/houston-sees-disparity-treatment-parks/)
- [District 4 community meeting on parks - April 30, 2015](http://us8.campaign-archive1.com/?u=6fe419e1bea63f17bb6c8842d&id=13e7c71daa)
- [North Austin green space becomes a priority for council - March 25, 2015](http://impactnews.com/austin-metro/northwest-austin/north-austin-green-space-becomes-a-priority-for-council)

See our progress: [Live Demo](http://open-austin.github.io/Austin_Parks_Acreage/)

##Credits

- **Maintainer**: [@mateoclarke](https://github.com/mateoclarke) - dev
- [@kyoder](https://github.com/kyoder) - GIS Data Analysis
- [@wilsaj](https://github.com/wilsaj) - GIS & dev
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

## Makefile Instructions:
[TODO]

## Data sources & use:
- City of Austin, Parks and Rec Dept (PARD) Data
	- Basic Park Layer:
	- Amenities Layer:
	- Facitilies Layer:
	- Trails Layer:
- Open Street Map Park Data:
- Census.gov Data
	-  District Demographic Data:
	-  CitySDK API:
	

## Architectural Decisions & Known Issues:
- Our javascript files are messy. Based on the way this project grew from one map to many, we are currently making a seperate js file for each html page. This is bad and should eventually be fixed.
- For the park access heatmap, we ran a GIS process in ArcGIS. This static heatmap layer isn't response to park layers being toggled on and off. We'll probably use CartoDB to host these heatmaps in the future and rely on their PostGIS servers to create simplified buffers vs the cost-distance analysis heatmap we are currently working with.


## Unlicense:
Released to the public domain under the [Unlicense](http://unlicense.org/) by [Open Austin](http://open-austin.org), 2015.

