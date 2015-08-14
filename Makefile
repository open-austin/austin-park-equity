.PHONY: osm-parks clean


osm-parks: data/osm-parks-filtered.geojson

clean:
	rm -rf tmp/*


tmp/osm-parks-all.geojson: data/osm-parks.ql
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
		node scripts/collect-features.js > $@
