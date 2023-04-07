const mysql = require('mysql');
const config = require('./config.json');

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

/**
 * Route 1: GET /species/random
 * Get a randomly selected bird species with common name, scientific name, description, and image link.
 *
 * @param {Object} req - The request object (unused).
 * @param {Object} res - The response object.
 *
 * @returns {Object} The bird species object, including common name, scientific name, description, and image link.
 *
 * @example
 * // Request:
 * // GET /species/random
 * //
 * // Response:
 * // {
 * //   "species_code": "amecro",
 * //   "family_code": "tur",
 * //   "common_name": "American Crow",
 * //   "scientific_name": "Corvus brachyrhynchos",
 * //   "species_description": "The American Crow is a large passerine bird...",
 * //   "species_img_link": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Corvus_brachyrhynchos_01.jpg/640px-Corvus_brachyrhynchos_01.jpg"
 * // }
 */
const birdOfTheDay = async function(_, res) {
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
      res.json(data[0]);
    }
  });
};

/**
 * Route 2: GET /species/info
 * Get details for a specific bird species.
 *
 * @param {Object} req - The request object
 * @param {string} req.query.species_code - The species code for the bird species to get details for.
 * @param {Object} res - The response object
 *
 * @returns {Object} The bird species details object, including common name, scientific name, description, image link, family common name, and family scientific name.
 *
 * @example
 * // Request:
 * // GET /species/info?species_code=evegro
 * //
 * // Response:
 * // {
 * //   "common_name": "Evening Grosbeak",
 * //   "scientific_name": "Coccothraustes vespertinus",
 * //   "species_description": "The genus Hesperiphona was introduced by Charles Lucien Bonaparte in 1850.[6] The name is from Ancient Greek hesperos, \"evening\", and phone \"cry\", and the specific vespertina is Latin for \"evening\".[7]",
 * //   "species_img_link": "upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Hesperiphona_vespertina_CT3.jpg/220px-Hesperiphona_vespertina_CT3.jpg",
 * //   "family_common_name": "Finches, Euphonias, and Allies",
 * //   "family_scientific_name": "Fringillidae"
 * // }
 */
const speciesInfo = async function(req, res) {
  connection.query(`
    SELECT 
      species.common_name,
      species.scientific_name,
      species.species_description,
      species.species_img_link,
      family.family_common_name,
      family.family_scientific_name
    FROM 
      species  
    JOIN family
      ON species.family_code = family.family_code
    WHERE species_code = '${req.query.species_code}';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); 
    } else {
      res.json(data[0]);
    }
  }
)}

// Route 3: GET /sightings/filtered
// parameters: start_date, end_date, name, location
const sightingsFiltered = async function(req, res) {

};

// Route 4: GET /sightings/recent
// parameters: species_code
const sightingsRecent = async function(req, res) {

}

// Route 5: GET /family/info
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

// Route 6: GET /family/species
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

/**
 * Route 7: POST /heatmap
 * Get a heatmap of bird sightings, filtered by time range, species and location.
 *
 * @param {Object} req - The request object. The request body can contain the following fields:
 *  - startDate {string} The start date for filtering sightings. If not provided, defaults to '2022-12-01'.
 *  - endDate {string} The end date for filtering sightings. If not provided, defaults to today's date.
 *  - commonName {string} The common name of the species to filter by.
 *  - scientificName {string} The scientific name of the species to filter by.
 *  - subnational1Name {string} The name of the subnational1 location to filter by.
 * @param {Object} res - The response object
 *
 * @returns {Object} An array of objects, each representing a location with species sightings, including the following fields:
 *  - species_code {string} The species code of the observed bird.
 *  - family_code {string} The family code of the observed bird.
 *  - latitude {number} The latitude of the location where the observation was made.
 *  - longitude {number} The longitude of the location where the observation was made.
 *  - scientific_name {string} The scientific name of the observed bird.
 *  - common_name {string} The common name of the observed bird.
 *  - total_count {number} The total count of observations for this species at this location.
 *
 * @example
 * // Request:
 * // POST /location/heatmap
 * // {
 * //   "startDate": "2023-01-01",
 * //   "endDate": "2023-3-31",
 * //   "commonName": "sparrow",
 * //   "subnational1Name": "California"
 * // }
 * //
 * // Response:
 * // [
 * //   {
 * //     "species_code": "AMGOL",
 * //     "family_code": "Emberizidae",
 * //     "latitude": 37.7749,
 * //     "longitude": -122.4194,
 * //     "scientific_name": "Aimophila ruficeps",
 * //     "common_name": "Rufous-crowned Sparrow",
 * //     "total_count": 1
 * //   },
 * //   {
 * //     "species_code": "FISP",
 * //     "family_code": "Fringillidae",
 * //     "latitude": 37.7749,
 * //     "longitude": -122.4194,
 * //     "scientific_name": "Spinus psaltria",
 * //     "common_name": "Lesser Goldfinch",
 * //     "total_count": 2
 * //   },
 * //   ...
 * // ]
 */
const heatMap = async function(req, res) {
  let { startDate, endDate, commonName, scientificName, subnational1Name } = req.body;

  if (!startDate && !endDate) {
    const today = new Date();
    startDate = '2022-12-01';
    endDate = today.toISOString().slice(0, 10);
  } else if (!startDate) {
    startDate = '2022-12-01';
  } else if (!endDate) {
    const today = new Date();
    endDate = today.toISOString().slice(0, 10);
  }

  commonName = commonName ? commonName.trim().toLowerCase() : undefined;
  scientificName = scientificName ? scientificName.trim().toLowerCase() : undefined;
  subnational1Name = subnational1Name ? subnational1Name.trim().toLowerCase() : undefined;

  let query = `
    WITH 
      sightings_filtered AS (
        SELECT 
          location_id, 
          species.species_code,
          species.family_code,
          scientific_name,
          common_name,
          observation_count
        FROM
          observation
        JOIN species 
          ON observation.species_code = species.species_code
        WHERE 
          (${commonName ? `LOWER(common_name) LIKE '%${commonName}%'` : '1 = 1'})
          AND (${scientificName ? `LOWER(scientific_name) LIKE '%${scientificName}%'` : '1 = 1'})
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
          ${subnational1Name ? `LOWER(S1.subnational1_name) LIKE '%${subnational1Name}%'` : '1 = 1'}
      )
    SELECT 
      species_code,
      family_code,
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

module.exports = {
  birdOfTheDay,
  speciesInfo,
  sightingsFiltered,
  sightingsRecent,
  familyInfo,
  familySpecies,
  heatMap
}
