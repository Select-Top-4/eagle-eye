const { request } = require("express");
const mysql = require("mysql");
const config = require("./config.json");

/******************
 * ROUTES *
 ******************/

// Route 1: GET /species/random
const birdOfTheDay = async function (req, res) {
  // mock
  const bird_of_the_day = {
    species_code: "rufmon1",
    family_code: "monarc2",
    common_name: "Rufous Monarch",
    scientific_name: "Symposiachrus rubiensis",
    species_description:
      "This Monarchidae-related article is a stub. You can help Wikipedia by expanding it.",
    species_img_link:
      "upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Naturalis_Biodiversity_Center_-_RMNH.AVES.136419_1_-_Monarcha_rubiensis_%28Meyer%2C_1874%29_-_Monarchidae_-_bird_skin_specimen.jpeg/220px-Naturalis_Biodiversity_Center_-_RMNH.AVES.136419_1_-_Monarcha_rubiensis_%28Meyer%2C_1874%29_-_Monarchidae_-_bird_skin_specimen.jpeg",
  };
  res.json(bird_of_the_day);
};

// Route 4: GET /species/info
// parameters: species_code
const speciesInfo = async function (req, res) {
  const species_info = {
    common_name: "Black-capped Chickadee",
    scientific_name: "Poecile atricapillus",
    species_description:
      "Though originally placed in the genus Parus with most other tits, mtDNA cytochrome b sequence data and morphology suggest that separating Poecile more adequately expresses these birds' relationships.[7] The genus Poecile had been introduced by German naturalist Johann Jakob Kaup in 1829.[8] Molecular phylogenetic studies have shown that the black-capped chickadee is sister to the mountain chickadee (Poecile gambeli).[9][10]",
    species_img_link:
      "upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Poecile-atricapilla-001.jpg/220px-Poecile-atricapilla-001.jpg",
    family_common_name: "Tits, Chickadees, and Titmice",
    family_scientific_name: "Paridae",
  };

  res.json(species_info);
};

// Route 2: GET /location/heat-map
// parameters: start_date, end_date, name, state
const locationHeatMap = async function (req, res) {
  const data = require("./json/heat-map-location.json");
  res.json(data);
};

// Route 3: GET /sightings/filtered
// parameters: start_date, end_date, name, location
const sightingsFiltered = async function (req, res) {
  const data = require("./json/sightings-filtered.json");
  res.json(data);
};

// Route 5: GET /sightings/recent
// parameters: species_code
const sightingsRecent = async function (req, res) {
  const recent_sightings = [
    {
      observation_count: 1,
      first_name: "Caitlin",
      location_name:
        "2646 Georgetowne Dr NW, Rochester US-MN 44.07798, -92.50146",
    },
    {
      observation_count: 1,
      first_name: "Paul",
      location_name: "106 Bear Walk Dr, Milford US-PA 41.29246, -74.88410",
    },
    {
      observation_count: 5,
      first_name: "Elinor",
      location_name:
        "1286 Lost Nation Rd, Craftsbury Common US-VT 44.69011, -72.35954",
    },
    {
      observation_count: 1,
      first_name: "Jeanette",
      location_name:
        "208 Krutz Road, Amsterdam, New York, US (42.922, -74.113)",
    },
    {
      observation_count: 1,
      first_name: "Fawn",
      location_name: "Wallace House Park",
    },
  ];
  res.json(recent_sightings);
};

// Route 6: GET /family/info
// parameters: family_code
const familyInfo = async function (req, res) {
  const family_info = {
    family_code: "trogon1",
    family_scientific_name: "Trogonidae",
    family_common_name: "Trogons",
    family_description:
      'The trogons and quetzals are birds in the order Trogoniformes /troʊˈɡɒnɪfɔːrmiːz/ which contains only one family, the Trogonidae. The family Trogonidae contains 46 species in seven genera. The fossil record of the trogons dates back 49 million years to the Early Eocene. They might constitute a member of the basal radiation of the order Coraciiformes and order Passeriformes or be closely related to mousebirds and owls. The word trogon is Greek for "nibbling" and refers to the fact that these birds gnaw holes in trees to make their nests.\n',
    species_img_link:
      "upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Hispaniolan_Trogon_%28Priotelus_roseigaster%29_%288082799519%29.jpg/220px-Hispaniolan_Trogon_%28Priotelus_roseigaster%29_%288082799519%29.jpg",
  };
  res.json(family_info);
};

// Route 7: GET /family/species
// parameters: family_code
const familySpecies = async function (req, res) {
  const data = require("./json/family-species.json");
  res.json(data);
};

// Route 8: GET /family/heat-map
// parameters: start_date, end_date, family_code
const familyHeatMap = async function (req, res) {
  const data = require("./json/heat-map-family.json");
  res.json(data);
};

module.exports = {
  familyHeatMap,
  familySpecies,
  familyInfo,
  sightingsRecent,
  sightingsFiltered,
  locationHeatMap,
  speciesInfo,
  birdOfTheDay,
};
