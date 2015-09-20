require "json"
require "csv"

parks_file      = File.read("raw/city_of_austin_parks.geojson")
amenities_file  = File.read("raw/pard_amenity_points.geojson")
facilities_file = File.read("raw/pard_facility_points.geojson")
trails_file     = File.read("raw/pard_trails_nrpa.geojson")
parks_data      = JSON.parse(parks_file)
amenities_data  = JSON.parse(amenities_file)
facilities_data = JSON.parse(facilities_file)
trails_data     = JSON.parse(trails_file)

# create an array of park names and ids
parks = []

parks_data["features"].each do |park|
  hash = {
    "name"    => park["properties"]["PARK_NAME"],
    "park_id" => park["properties"]["PARK_ID"].to_i,
    "status"  => park["properties"]["DEVELOPMENT_STATUS"],
    "amenities_count"  => 0,
    "facilities_count" => 0,
    "trails_count"     => 0
  }
  parks << hash
end

# method to count features by park_id
def count_park_feature(data, count, parks)
  data["features"].each do |item|
    feature_park_id = item["properties"]["PARK_ID"].to_i

    parks.select do |park|
      if park["park_id"] == feature_park_id
        park[count] += 1
      end
    end
  end
end

# loop through pard_***_points.json's for count of features for each park
count_park_feature(amenities_data, "amenities_count", parks)
count_park_feature(facilities_data, "facilities_count", parks)
count_park_feature(trails_data, "trails_count", parks)

# sum number of amenities, facilities, and trails for each park
parks.each do |park|
  am_fac_sum = park["amenities_count"] + park["facilities_count"]
  park["am_plus_fac_sum"] = am_fac_sum

  attractions_sum = park["trails_count"] + park["amenities_count"] + park["facilities_count"]
  park["attractions_sum"] = attractions_sum


  # Text Summary of Inconsistencies
  if am_fac_sum > 0 && park["status"] == "Undeveloped"
    puts "#{park["name"]} -- #{am_fac_sum} amenities/facilities -- Listed as #{park['status']}"
  end

  if am_fac_sum == 0 && park["status"] == "Developed"
    puts "#{park["name"]} -- #{am_fac_sum} amenities/facilities -- Listed as #{park['status']}"
  end
end

# export as csv file
CSV.open("data/park_attraction_counts.csv", "w") do |csv|
  csv << ["Park Name", "Park ID", "Development Status", "Amenities", "Facilities", "Trails", "Amenities + Facilities","Attractions Sum"]

  parks.each_with_index do |park, index|
    csv << [park["name"], park["park_id"], park["status"], park["amenities_count"], park["facilities_count"], park["trails_count"], park["am_plus_fac_sum"], park["attractions_sum"]]
  end
end

# export as json
File.open("data/park_attraction_counts.geojson", "w") do |file|
  file.puts parks.to_json
end
