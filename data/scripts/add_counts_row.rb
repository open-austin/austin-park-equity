require "json"

parks_file        = File.read("geojson/city_of_austin_parks.geojson")
attractions_file  = File.read("json/park_attraction_counts.json")
parks_data        = JSON.parse(parks_file)
attractions_data  = JSON.parse(attractions_file)

parks = {}

parks_data["features"].each do |park|
  park_id = park["properties"]["PARK_ID"]

  attractions_data.each do |item|
    feature_park_id = item["park_id"].to_i

      if park_id.to_i == feature_park_id
        park["properties"]["amenities_count"]   = item["amenities_count"]
        park["properties"]["facilities_count"]  = item["facilities_count"]
        park["properties"]["trails_count"]      = item["trails_count"]
        park["properties"]["am_plus_fac_sum"]   = item["am_plus_fac_sum"]
        park["properties"]["attractions_sum"]   = item["attractions_sum"]
      end
    end
end

# puts parks_data["features"].first["properties"]

# export as json
File.open("geojson/city_of_austin_parks_amfac_counts.geojson", "w") do |file|
  file.puts parks_data.to_json
end
