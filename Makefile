.PHONY: osm-parks clean


clean:
	rm -rf tmp/*



tmp/osm-parks-all.geojson: data/osm-parks.ql
	mkdir -p $(dir $@)
	node_modules/query-overpass/cli.js $< > $@
