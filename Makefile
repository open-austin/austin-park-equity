.PHONY: osm-parks clean


osm-parks: data/osm-parks-filtered.js
land-use: data/land-use-2012-all.js

clean:
	rm -rf tmp/*


tmp/osm-parks-all.geojson: scripts/osm-parks.ql
	mkdir -p $(dir $@)
	node_modules/query-overpass/cli.js $< > $@

tmp/coa-individual-parks.geojson: data/city_of_austin_parks.geojson
	mkdir -p $(dir $@)
	cat $< | node scripts/uncollect-features.js > $@

data/osm-parks-filtered.geojson: tmp/osm-parks-all.geojson tmp/coa-individual-parks.geojson
	mkdir -p $(dir $@)
	cat $< | \
		node scripts/uncollect-features.js | \
		node scripts/filter-intersecting.js $(word 2, $^) | \
		node scripts/elevate-tags.js | \
		node scripts/collect-features.js > $@

data/osm-parks-filtered.js: data/osm-parks-filtered.geojson
	mkdir -p $(dir $@)
	sed '1s/^/var osmParks = /' $< > $@


tmp/Land_Use_2012.zip:
	mkdir -p $(dir $@)
	curl 'https://data.austintexas.gov/api/geospatial/c2c6-6rve?method=export&format=Shapefile' > $@

tmp/land_use_2012.shp: tmp/Land_Use_2012.zip
	mkdir -p $(dir $@)
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*; do chmod 644 $$file; mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)
	touch $@

tmp/land_use_2012/parks-or-greenbelts.geojson: tmp/land_use_2012.shp
	mkdir -p $(dir $@)
	ogr2ogr -f "GeoJSON" -t_srs crs:84 -select 'LAND_USE,GENERAL_LA' -where "LAND_USE = '710'" /vsistdout/ $< | \
		node scripts/uncollect-features.js | \
		node scripts/set-properties.js '{"source": "Land Use 2012", "source_href": "https://data.austintexas.gov/Geodata/Land-Use-2012/c2c6-6rve", "type": "Park or Greenbelt"}' | \
		node scripts/collect-features.js > $@

tmp/land_use_2012/golf-courses.geojson: tmp/land_use_2012.shp
	mkdir -p $(dir $@)
	ogr2ogr -f "GeoJSON" -t_srs crs:84 -select 'LAND_USE,GENERAL_LA' -where "LAND_USE = '720'" /vsistdout/ $< | \
		node scripts/uncollect-features.js | \
		node scripts/set-properties.js '{"source": "Land Use 2012", "source_href": "https://data.austintexas.gov/Geodata/Land-Use-2012/c2c6-6rve", "type": "Golf Course"}' | \
		node scripts/collect-features.js > $@

tmp/land_use_2012/camp-grounds.geojson: tmp/land_use_2012.shp
	mkdir -p $(dir $@)
	ogr2ogr -f "GeoJSON" -t_srs crs:84 -select 'LAND_USE,GENERAL_LA' -where "LAND_USE = '730'" /vsistdout/ $< | \
		node scripts/uncollect-features.js | \
		node scripts/set-properties.js '{"source": "Land Use 2012", "source_href": "https://data.austintexas.gov/Geodata/Land-Use-2012/c2c6-6rve", "type": "Camp Ground"}' | \
		node scripts/collect-features.js > $@

tmp/land_use_2012/common-areas.geojson: tmp/land_use_2012.shp
	mkdir -p $(dir $@)
	ogr2ogr -f "GeoJSON" -t_srs crs:84 -select 'LAND_USE,GENERAL_LA' -where "LAND_USE = '740'" /vsistdout/ $< | \
		node scripts/uncollect-features.js | \
		node scripts/set-properties.js '{"source": "Land Use 2012", "source_href": "https://data.austintexas.gov/Geodata/Land-Use-2012/c2c6-6rve", "type": "Common Area"}' | \
		node scripts/collect-features.js > $@

tmp/land_use_2012/preserves.geojson: tmp/land_use_2012.shp
	mkdir -p $(dir $@)
	ogr2ogr -f "GeoJSON" -t_srs crs:84 -select 'LAND_USE,GENERAL_LA' -where "LAND_USE = '750'" /vsistdout/ $< | \
		node scripts/uncollect-features.js | \
		node scripts/set-properties.js '{"source": "Land Use 2012", "source_href": "https://data.austintexas.gov/Geodata/Land-Use-2012/c2c6-6rve", "type": "Preserve"}' | \
		node scripts/collect-features.js > $@

data/land-use-2012-all.geojson: tmp/land_use_2012/parks-or-greenbelts.geojson tmp/land_use_2012/golf-courses.geojson tmp/land_use_2012/camp-grounds.geojson tmp/land_use_2012/common-areas.geojson tmp/land_use_2012/preserves.geojson
	mkdir -p $(dir $@)
	cat $^ | \
		node scripts/uncollect-features.js | \
		node scripts/collect-features.js > $@

data/land-use-2012-all.js: data/land-use-2012-all.geojson
	mkdir -p $(dir $@)
	sed '1s/^/var landuseParks = /' $< > $@


tmp/coa-parks.zip:
	mkdir -p $(dir $@)
	curl 'https://data.austintexas.gov/api/geospatial/99qw-4ixs?method=export&format=Shapefile' -o $@

tmp/coa-parks.shp: tmp/coa-parks.zip
	unzip -d $(basename $@) $<

# download layers as geojson from CoA ArcGIS Server
raw/%.geojson:
	mkdir -p $(dir $@)
	curl "http://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/$(notdir $(basename $@))/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=pgeojson&token=" > $@

# transform raw CoA geojson to EPSG:4326 
tmp/transformed/%.geojson: raw/%.geojson
	mkdir -p $(dir $@)
	ogr2ogr -f "GeoJSON" -t_srs EPSG:4326 $@ $<

# generate park_attraction_counts files
data/park_attraction_counts.geojson: raw/city_of_austin_parks.geojson raw/pard_amenity_points.geojson raw/pard_facility_points.geojson raw/pard_trails_nrpa.geojson
	mkdir -p $(dir $@)
	ruby scripts/park_data.rb

data/park_attraction_counts.csv: raw/city_of_austin_parks.geojson raw/pard_amenity_points.geojson raw/pard_facility_points.geojson raw/pard_trails_nrpa.geojson
	mkdir -p $(dir $@)
	ruby scripts/park_data.rb
