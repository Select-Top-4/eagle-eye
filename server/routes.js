const mysql = require('mysql')
const config = require('./config.json')

const connection = process.env.NODE_ENV === "production" ? mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
}) : mysql.createConnection({
  host: config.local_host,
  user: config.local_user,
  password: config.local_password,
  port: config.local_port,
  database: config.local_db
});

connection.connect((err) => err && console.log(err));

// Route 1: GET /species/random
const birdOfTheDay = async function(req, res) {
  connection.query(`
  SELECT 
    species_code,
    family_code,
    common_name,
    scientific_name,
    species_description,
    species_img_link
  FROM   
    species
  WHERE  
    common_name IS NOT NULL
    AND scientific_name IS NOT NULL
    AND TRIM(species_description) != ""
    AND species_description IS NOT NULL
    AND species_description != "No description"
    AND TRIM(species_img_link) != ""
    AND species_img_link IS NOT NULL
    AND species_img_link != "No image src"
  ORDER BY RAND()
  LIMIT 1;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        common_name: data[0].common_name,
        scientific_name: data[0].scientific_name,
        species_description: data[0].species_description,
        species_img_link: data[0].species_img_link
      });
    }
  });
};

// Route 4: GET /species-info
// parameters: species_code
const speciesInfo = async function(req, res) {

}

// Route 2: GET /location/heat-map
// parameters: start_date, end_date, name, state
const locationHeatMap = async function(req, res) {

};

// Route 3: GET /sightings/filtered
// parameters: start_date, end_date, name, location
const sightingsFiltered = async function(req, res) {

};

// Route 5: GET /sightings/recent
// parameters: species_code
const sightingsRecent = async function(req, res) {

}

// Route 6: GET /family/info
// parameters: family_code
const familyInfo = async function(req, res) {
  connection.query(`
  SELECT family.family_code,
  family_scientific_name,
  family_common_name,
  family_description,
  species_img_link
  FROM   family
    JOIN species
      ON family.family_code = species.family_code
  WHERE  family.family_code = '{page_family_code}'
  ORDER  BY RAND ()
  LIMIT  1; 
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      console.log(data);
      res.json({
        family_code: data[0].family.family_code
      });
    }
  });
}

// Route 7: GET /family/species
// parameters: family_code
const familySpecies = async function(req, res) {
  connection.query(`
  SELECT common_name,
  species_code
    FROM   species
    WHERE  family_code = '{page_family_code}'
    ORDER  BY RAND();
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      console.log(data);
      res.json({
        family_code: data[0].family_code
      });
    }
  });
}

// Route 8: GET /family/heat-map
// parameters: start_date, end_date, family_code
const familyHeatMap = async function(req, res) {

}

module.exports = {
  familyHeatMap,
  familySpecies,
  familyInfo,
  sightingsRecent,
  sightingsFiltered,
  locationHeatMap,
  speciesInfo,
  birdOfTheDay
}
