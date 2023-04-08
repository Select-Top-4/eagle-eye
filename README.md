# eagle-eye
Eagle Eye serves as a public resource for users to search for any bird species, track each instance of birds across the United States and display information on each species that includes description, related species, what regions are they common and other related information.


# GET /random/species
Randomly selects a bird species to show on home page. Bird common name species, scientific name, description and image link are all returned

# GET /all-species
Get a paginated list of bird species with common name, scientific name, description, and image link. Returns an array of bird species objects, including species code, family code, common name, scientific name, species description, image link, whether it is extinct and the year of extinction.

# GET /species/{species_code}
Given a specific bird species (in the form of a code), returns details of that specific bird species. Details include species code, family code, common name, scientific name, description, image link, whether it is extinct, the year of extinction, family common name, and family scientific name.

# GET /species/{species_code}/5-latest-observations
Returns the 5 most recent observations with location and user display name information. Including count of birds observed, the bird watcher's first name and the location name for the observation.

# GET /specific-observations/{species_code}
Given a specific bird species, returns all observations filtered by time range, user and location. 

# GET /families
Returns a list of bird families with their scientific and common names, description and a randomly selected image link. 

# GET /family/{family_code}
Based on a family code, returns information about a bird family. 

# GET /species/families/{family_code}
Given a specific family code, returns all specific bird species that fall under that bird family.

# GET /location/{location_id}
Given a {location_id}, returns location based on its ID

# GET /heatmap-observations 
Returns metadata to create the heatmap showing densities of bird sightings, filtered by time range, species and location. 

# GET /heatmap-observations/species-ranking
Returns a paginated species ranking based on a heatmap of bird observations, filtered by time range, species, family and location.