# Austin_Parks_Acreage

This is a civic app that aims to help visualize how Austin's park resources are distributed throughout the city.

Methodology:

- **Recieve raw data** via Councilman Casar's Directory of Policy.
- **Refine data** by adding Lat & Long from "PARK ADDRESS SERVICE" row using [Geo](https://github.com/mapbox/geo-googledocs/) for Google Spreadsheets.
- Where Geo failed to find Lat/Long from Address, use [Get Lat Lon](http://dbsgeo.com/latlon/) web service. 14 (out of 148) Parks Locations required this manually reference after Geo failed.
- Where still uncertain with Get Lat Lon, use Google Maps by searching "PARK NAME" field.
