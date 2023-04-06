const mysql = require('mysql');
const config = require('./config.json');

// Create a MySQL connection using the configuration settings from config.json.
// Use different settings depending on the environment (production or development).
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

// Connect to the MySQL database.
// If there is an error, log it to the console.
connection.connect((err) => err && console.log(err));

/**
 * GET /species/random
 * Get a random bird species with common name, scientific name, description, and image link.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 *
 * @returns {Object} The bird species object, including common name, scientific name, description, and image link.
 *
 * @example
 * // Request:
 * // GET /species/random
 * //
 * // Response:
 * // {
 * //   "common_name": "American Robin",
 * //   "scientific_name": "Turdus migratorius",
 * //   "species_description": "The American Robin is a migratory songbird...",
 * //   "species_img_link": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Turdus_migratorius_%28Eastern_phenotype%29_-Ottawa%2C_Ontario%2C_Canada-8.jpg/640px-Turdus_migratorius_%28Eastern_phenotype%29_-Ottawa%2C_Ontario%2C_Canada-8.jpg"
 * // }
 */
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
        commonName: data[0].common_name,
        scientificName: data[0].scientific_name,
        speciesDescription: data[0].species_description,
        speciesImgLink: data[0].species_img_link
      });
    }
  });
};

// Route 4: GET /species-info
// parameters: species_code
const speciesInfo = async function(req, res) {

}

// Route 2: POST /location/heat-map
// Get a heat map of bird sightings for a given location and time period.
//
// @param {string} req.body.start_date - The start date of the time period to filter sightings by (YYYY-MM-DD).
// @param {string} req.body.end_date - The end date of the time period to filter sightings by (YYYY-MM-DD).
// @param {string} req.body.common_name - The common name of the bird species to filter sightings by.
// @param {string} req.body.scientific_name - The scientific name of the bird species to filter sightings by.
// @param {string} req.body.subnational1_name - The name of the top-level administrative subdivision to filter locations by (e.g., state).
//
// @returns {Object[]} An array of objects representing bird sightings in the specified location(s) and time period.
// Each object includes the following properties:
//   - latitude (number): The latitude of the sighting location.
//   - longitude (number): The longitude of the sighting location.
//   - scientific_name (string): The scientific name of the bird species observed.
//   - common_name (string): The common name of the bird species observed.
//   - total_count (number): The total number of observations of the bird species in the specified time period.
//
// @example
// // Request:
// // POST /location/heat-map
// // {
// //   "start_date": "2022-01-01",
// //   "end_date": "2022-12-31",
// //   "common_name": "American Robin",
// //   "scientific_name": "",
// //   "subnational1_name": "California"
// // }
// //
// // Response:
// // [
// //   {
// //     "latitude": 37.7749,
// //     "longitude": -122.4194,
// //     "scientific_name": "Turdus migratorius",
// //     "common_name": "American Robin",
// //     "total_count": 15
// //   },
// //   {
// //     "latitude": 34.0522,
// //     "longitude": -118.2437,
// //     "scientific_name": "Turdus migratorius",
// //     "common_name": "American Robin",
// //     "total_count": 8
// //   }
// // ]
const locationHeatMap = async function(req, res) {
  let { startDate, endDate, commonName, scientificName, subnational1Name } = req.body;

  // Set default values for missing parameters.
  if (!startDate && !endDate) {
    const today = new Date();
        startDate = '1900-01-01';
    endDate = today.toISOString().slice(0, 10);
  } else if (!startDate) {
    startDate = '1900-01-01';
  } else if (!endDate) {
    const today = new Date();
    endDate = today.toISOString().slice(0, 10);
  }

  let query = `
    WITH 
      sightings_filtered AS (
        SELECT 
          location_id, 
          scientific_name,
          common_name,
          observation_count
        FROM
          observation
        JOIN species 
          ON
          observation.species_code = species.species_code
        WHERE 
          (${commonName ? `common_name = '${commonName}'` : '1 = 1'})
          AND (${scientificName ? `scientific_name = '${scientificName}'` : '1 = 1'})
          AND (${startDate ? `CAST(observation_date AS DATE) >= '${startDate}'` : '1 = 1'})
          AND (${endDate ? `CAST(observation_date AS DATE) <= '${endDate}'` : '1 = 1'})
      ), 
      locations_filtered AS (
        SELECT 
          location_id,
          latitude,
          longitude
        FROM 
          ebird_location E
        JOIN subnational2 S2
          ON E.subnational2_code = S2.subnational2_code
        JOIN subnational1 S1
          ON S2.subnational1_code = S1.subnational1_code
        WHERE 
          (${subnational1Name ? `S1.subnational1_name = '${subnational1Name}'` : '1 = 1'})
          OR S2.subnational2_name = ''
      )
    SELECT 
      latitude,
      longitude,
      scientific_name,
      common_name,
      Sum(observation_count) AS total_count
    FROM 
      sightings_filtered S
    JOIN locations_filtered L
      ON S.location_id = L.location_id
    GROUP BY 1, 2, 3, 4;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(results);
    }
  });
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
