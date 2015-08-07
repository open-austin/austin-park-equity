require "json"
require "csv"

parks_file      = File.read("raw/city_of_austin_parks.json")
amenities_file  = File.read("raw/pard_amenity_points.json")
facilities_file = File.read("raw/pard_facility_points.json")
trails_file     = File.read("raw/pard_trails_nrpa.json")
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

# loop through pard_amenity_points.json for count of amenities for each park
amenities_data["features"].each do |amenity|
  am_park_id = amenity["properties"]["PARK_ID"].to_i

  parks.select do |park|
    if park["park_id"] == am_park_id
      park["amenities_count"] += 1
    end
  end
end

# loop through pard_facility_points.json for count of facilities for each park
facilities_data["features"].each do |facility|
  fac_park_id = facility["properties"]["PARK_ID"].to_i

  parks.select do |park|
    if park["park_id"] == fac_park_id
      park["facilities_count"] += 1
    end
  end
end

# loop through pard_trails_points.json for count of trails for each park
trails_data["features"].each do |facility|
  tr_park_id = facility["properties"]["PARK_ID"].to_i

  parks.select do |park|
    if park["park_id"] == tr_park_id
      park["trails_count"] += 1
    end
  end
end

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

# export as csv
CSV.open("park_attraction_counts.csv", "w") do |csv|
  csv << ["Park Name", "Park ID", "Development Status", "Amenities", "Facilities", "Trails", "Amenities + Facilities","Attractions Sum"]

  parks.each_with_index do |park, index|
    csv << [park["name"], park["park_id"], park["status"], park["amenities_count"], park["facilities_count"], park["trails_count"], park["am_plus_fac_sum"], park["attractions_sum"]]
  end
end


# puts parks




