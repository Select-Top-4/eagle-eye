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
 * @route GET /random/species
 * @description Get a randomly selected bird species with common name, scientific name, description, and image link.
 * @param {Object} req - The request object (unused).
 * @param {Object} res - The response object.
 * @returns {Object} The bird species object, including species code, family code, common name, scientific name, 
 * species description, image link, whether it is extinct and the year of extinction.
 * @example
 * // Request:
 * // GET /random/species
 * //
 * // Response:
 * // {
 * //   "species_code": "capher1",
 * //   "family_code": "ardeid1",
 * //   "common_name": "Capped Heron",
 * //   "scientific_name": "Pilherodius pileatus",
 * //   "species_description": "This species is very distinct from other herons, being the only one with a blue beak and face, and a black crown...",
 * //   "species_img_link": "upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Kappenreiher_Pilherodius_pileatus.jpg/220px-Kappenreiher_Pilherodius_pileatus.jpg",
 * //   "extinct": 0,
 * //   "extinct_year": ""
 * // }
 */
const getRandomSpecies = async function(_, res) {
  connection.query(`
    SELECT 
      species_code,
      family_code,
      common_name,
      scientific_name,
      species_description,
      species_img_link,
      extinct,
      extinct_year
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
 * @route GET /all-species
 * @description Get a paginated list of bird species with common name, scientific name, description, and image link.
 * @param {Object} req - The request object. The request query can contain the following fields:
 *  - page {number} The page number for pagination. Defaults to 1.
 *  - limit {number} The limit of results per page. Defaults to 10.
 * @param {Object} res - The response object.
 * @returns {Object} An array of bird species objects, including species code, family code, common name, scientific name, 
 * species description, image link, whether it is extinct and the year of extinction.
 * @example
 * // Request:
 * // GET /all-species?page=2&limit=5
 * //
 * // Response:
 * // [
 * //   {
 * //       "species_code": "abdsto1",
 * //       "family_code": "ciconi2",
 * //       "common_name": "Abdim's Stork",
 * //       "scientific_name": "Ciconia abdimii",
 * //       "species_description": "Ciconia abdimii is a black stork with grey legs, red knees and feet, grey bill and white underparts...",
 * //       "species_img_link": "upload.wikimedia.org/wikipedia/commons/thumb/3/37/Ciconia_abdimii_-London_Zoo-8a.jpg/220px-Ciconia_abdimii_-London_Zoo-8a.jpg",
 * //       "extinct": 0,
 * //       "extinct_year": "",
 * //       "family_common_name": "Storks",
 * //       "family_scientific_name": "Ciconiidae"
 * //   },
 * //   ...
 * // ]
 */
const getAllSpecies = async function(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  
  connection.query(`
    SELECT 
      species_code,
      species.family_code,
      species.common_name,
      species.scientific_name,
      species.species_description,
      species.species_img_link,
      species.extinct,
      species.extinct_year,
      family.family_common_name,
      family.family_scientific_name
    FROM 
      species  
    JOIN family
      ON species.family_code = family.family_code
    WHERE 
      common_name IS NOT NULL
      AND scientific_name IS NOT NULL
      AND TRIM(species_description) != ""
      AND species_description IS NOT NULL
      AND species_description != "No description"
      AND TRIM(species_img_link) != ""
      AND species_img_link IS NOT NULL
      AND species_img_link != "No image src"
    LIMIT ?, ?;
  `, [offset, parseInt(limit)], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]); 
    } else {
      res.json(data);
    }
  });
};

/**
 * @route GET /species/:species_code
 * @description Get details for a specific bird species.
 * @param {Object} req - The request object
 * @param {string} req.params.species_code - The species code for the bird species to get details for.
 * @param {Object} res - The response object
 * @returns {Object} The bird species details object, including species code, family code, common name, 
 * scientific name, description, image link, whether it is extinct, the year of extinction,
 * family common name, and family scientific name.
 * @example
 * // Request:
 * // GET /species/evegro
 * //
 * // Response:
 * // {
 * //   "species_code": "evegro",
 * //   "family_code": "fringi1",
 * //   "common_name": "Evening Grosbeak",
 * //   "scientific_name": "Coccothraustes vespertinus",
 * //   "species_description": "The genus Hesperiphona was introduced by Charles Lucien Bonaparte in 1850...",
 * //   "species_img_link": "upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Hesperiphona_vespertina_CT3.jpg/220px-Hesperiphona_vespertina_CT3.jpg",
 * //   "extinct": 0,
 * //   "extinct_year": "",
 * //   "family_common_name": "Finches, Euphonias, and Allies",
 * //   "family_scientific_name": "Fringillidae"
 * // }
 */
const getOneSpecies = async function(req, res) {
  connection.query(`
    SELECT 
      species_code,
      species.family_code,
      species.common_name,
      species.scientific_name,
      species.species_description,
      species.species_img_link,
      species.extinct,
      species.extinct_year,
      family.family_common_name,
      family.family_scientific_name
    FROM 
      species  
    JOIN family
      ON species.family_code = family.family_code
    WHERE 
      species_code = '${req.params.species_code}';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); 
    } else {
      res.json(data[0]);
    }
  }
)}

/**
 * @route GET /species/:species_code/5-latest-observations
 * @description Get the 5 most recent observations with location and user display name information.
 * @param {Object} req - The request object 
 * @param {string} req.params.species_code - The species code of the bird species.
 * @param {Object} res - The response object
 * @returns {Object[]} An array of at most 5 recent observations object, including count of birds observed, 
 * the bird watcher's first name, and the location name for the observation
 * @example
 * //Request:
 * // GET /species/bkcchi/5-latest-observations
 * // 
 * // Response: 
 * // [
 * //   {"observation_count":1,
 * //   "first_name":"Anonymous",
 * //   "location_name":"Green Hills County Park, Raleigh US-NC (35.9113,-78.5758)"
 * //   },
 * //   ...
 * // ]  
 */
const get5LatestObservationsBySpeciesCode = async function(req, res) {
  let query = `
    SELECT 
      observation_count,
      ebird_user.first_name,
      location_name
    FROM 
      observation  
    JOIN ebird_location
      ON observation.location_id = ebird_location.location_id
    JOIN ebird_user
      ON observation.user_id = ebird_user.user_id
    WHERE 
      species_code = '${req.params.species_code}' AND ebird_user.first_name IS NOT NULL
    ORDER BY 
      observation_date DESC
    LIMIT 5;
  `;
  
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

/**
 * @route POST /specific-observations/:species_code
 * @description Search observations for a specific bird species, filtered by time range, user, and location.
 * @param {Object} req - The request object. The request body can contain the following fields:
 *  - startDate {string} The start date for filtering observations. If not provided, defaults to '2022-12-01'.
 *  - endDate {string} The end date for filtering observations. If not provided, defaults to today's date.
 *  - userName {string} The name of the user who made the observation.
 *  - subnational1Name {string} The name of the subnational1 location of the observation.
 *  - subnational2Name {string} The name of the subnational2 location of the observation.
 *  - locationName {string} The name of the location of the observation.
 * @param {Object} res - The response object.
 * @returns {Object[]} An array of objects, each representing a bird observation, including the following fields:
 *  - location_id {string} The location ID of the observation.
 *  - location_name {string} The name of the location of the observation.
 *  - subnational1_name {string} The name of the subnational1 location of the observation.
 *  - subnational2_name {string} The name of the subnational2 location of the observation.
 *  - full_name {string} The full name of the user who made the observation.
 *  - latitude {number} The latitude of the location where the observation was made.
 *  - longitude {number} The longitude of the location where the observation was made.
 *  - total_count {number} The total count of the observed bird species at this location.
 * @example
 * // Request:
 * // POST /species/reshaw/observations
 * // Request Body: 
 * // {
 * //   "userName": "rick",
 * //   "subnational1Name": "alabama",
 * //   "subnational2Name": "lim",
 * //   "locationName": "Rd"
 * // }
 * //
 * // Response:
 * // [
 * //   {
 * //     "location_id": "L22245955",
 * //     "location_name": "15950–16498 Goode Rd, Tanner US-AL 34.69571, -87.03429",
 * //     "subnational1_name": "Alabama",
 * //     "subnational2_name": "Limestone",
 * //     "full_name": "Patrick Coy",
 * //     "latitude": 34.695711,
 * //     "longitude": -87.03429,
 * //     "total_count": 1
 * //   }
 * // ]
 */
const searchSpecificObservationsBySpeciesCode = async function(req, res) {
  let { startDate, 
        endDate, 
        userName, 
        subnational1Name, 
        subnational2Name,
        locationName} = req.body;

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

  userName = userName ? userName.trim().toLowerCase() : undefined;
  subnational1Name = subnational1Name ? subnational1Name.trim().toLowerCase() : undefined;
  subnational2Name = subnational2Name ? subnational2Name.trim().toLowerCase() : undefined;
  locationName = locationName ? locationName.trim().toLowerCase() : undefined;

  let query = `
    SELECT 
      L.location_id,
      L.location_name,
      S1.subnational1_name,
      S2.subnational2_name,
      CONCAT(U.first_name, ' ', U.last_name) AS full_name,
      L.latitude,
      L.longitude,
      SUM(O.observation_count) AS total_count
    FROM 
      observation O
    JOIN
      ebird_user U
      ON O.user_id = U.user_id
    JOIN 
      ebird_location L
      ON O.location_id = L.location_id
    JOIN 
      subnational2 S2
      ON L.subnational2_code = S2.subnational2_code
    JOIN
      subnational1 S1
      ON S2.subnational1_code = S1.subnational1_code
    WHERE
      O.species_code = '${req.params.species_code}'
      AND ${userName ? `LOWER(CONCAT(first_name, ' ', last_name)) LIKE '%${userName}%'` : '1 = 1'}
      AND ${subnational1Name ? `LOWER(subnational1_name) LIKE '%${subnational1Name}%'` : '1 = 1'}
      AND ${subnational2Name ? `LOWER(subnational2_name) LIKE '%${subnational2Name}%'` : '1 = 1'}
      AND ${locationName? `LOWER(location_name) LIKE '%${locationName}%'` : '1 = 1'}
      AND ${startDate ? `CAST(observation_date AS DATE) >= '${startDate}'` : '1 = 1'}
      AND ${endDate ? `CAST(observation_date AS DATE) <= '${endDate}'` : '1 = 1'}
    GROUP BY 1, 2, 3, 4, 5, 6, 7;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

/**
 * @route GET /families
 * @description Get a list of bird families with their scientific and common names, description, and a randomly selected image link.
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters for pagination:
 * @param {number} req.query.page - The current page number (default: 1).
 * @param {number} req.query.limit - The number of results per page (default: 10).
 * @param {Object} res - The response object.
 * @returns {Object[]} An array of objects, each representing a bird family with the following fields:
 *  - family_code {string} The code of the family.
 *  - family_scientific_name {string} The scientific name of the family.
 *  - family_common_name {string} The common name of the family.
 *  - family_description {string} The description of the family.
 *  - random_family_img_link {string} A randomly selected image link for a bird species in this family.
 * @example
 * // Request:
 * // GET /families?page=2&limit=5
 * //
 * // Response:
 * // [
 * //   {
 * //       "family_code": "accipi1",
 * //       "family_scientific_name": "Accipitridae",
 * //       "family_common_name": "Hawks, Eagles, and Kites",
 * //       "family_description": "The accipitrids are recognizable by a peculiar rearrangement of their chromosomes...",
 * //       "random_family_img_link": "upload.wikimedia.org/wikipedia/commons/thumb/0/00/Buteo_albigula.PNG/220px-Buteo_albigula.PNG"
 * //   },
 * //   ...
 * // ]
 */
const getAllFamilies = async function(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  
  connection.query(`
    SELECT 
      family.family_code,
      family_scientific_name,
      family_common_name,
      family_description,
      MIN(species_img_link) AS random_family_img_link
    FROM 
      family
    JOIN species
      ON family.family_code = species.family_code
    WHERE 
      TRIM(family_description) != ""
      AND family_description IS NOT NULL
      AND TRIM(species_img_link) != ""
      AND species_img_link IS NOT NULL
      AND species_img_link != "No image src"
    GROUP BY 1, 2, 3, 4
    LIMIT ?, ?;
  `, [offset, parseInt(limit)], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]); 
    } else {
      res.json(data);
    }
  });
};

/**
 * @route GET /family/:family_code
 * @description Get information about a bird family by its family code.
 * @param {Object} req.params.family_code The family code of the bird family.
 * @param {Object} res - The response object
 * @returns {Object} An object containing information about the bird family, including the following fields:
 *  - family_code {string} The family code of the bird family.
 *  - family_scientific_name {string} The scientific name of the bird family.
 *  - family_common_name {string} The common name of the bird family.
 *  - family_description {string} A description of the bird family.
 *  - random_family_img_link {string} A link to an image of a random species from the bird family.
 * @example
 * // Request:
 * // GET /family/accipi1
 * //
 * // Response:
 * // {
 * //   "family_code": "fringi1",
 * //   "family_scientific_name": "Fringillidae",
 * //   "family_common_name": "Finches, Euphonias, and Allies",
 * //   "family_description": "Beginning around 1990 a series of phylogenetic studies based on mitochondrial and nuclear DNA sequences...",
 * //   "random_family_img_link": "upload.wikimedia.org/wikipedia/commons/thumb/a/af/Streaked_Rosefinch.jpg/220px-Streaked_Rosefinch.jpg"
 * // }
 */
const getOneFamily = async function(req, res) {
  connection.query(`
    SELECT 
      family.family_code,
      family_scientific_name,
      family_common_name,
      family_description,
      species_img_link AS random_family_img_link
    FROM 
      family
    JOIN species
      ON family.family_code = species.family_code
    WHERE 
      family.family_code = '${req.params.family_code}'
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
}

/**
 * @route GET /species/families/:family_code
 * @description Get all species for a given family code.
 * @param {Object} req.params.family_code The family code of the bird family.
 * @param {Object} res - The response object.
 * @returns {Object} An array of objects, each representing a species with the following fields:
 *  - species_code {string} The code of the species.
 *  - common_name {string} The common name of the species.
 *  - scientific_name {string} The scientific name of the species.
 * @example
 * // Request:
 * // GET /family/fringi1/species
 * //
 * // Response:
 * // [
 * //   {
 * //     "species_code": "comcha2",
 * //     "common_name": "Common Chaffinch (Tunisian)",
 * //     "scientific_name": "Fringilla coelebs spodiogenys"
 * //   },
 * //   {
 * //     "species_code": "eurgol1",
 * //     "common_name": "European Goldfinch (European)",
 * //     "scientific_name": "Carduelis carduelis [carduelis Group]"
 * //   },
 * //   ...
 * // ]
 */
const getAllSpeciesByFamilyCode = async function(req, res) {
  connection.query(`
    SELECT
      species_code,
      common_name,
      scientific_name
    FROM 
      species
    WHERE 
      family_code = '${req.params.family_code}'
    ORDER BY RAND();
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]); 
    } else {
      res.json(data);
    }
  });
}

/**
 * @route GET /location/:location_id
 * @description Get a location by its ID.
 * @param {Object} req - The request object.
 * @param {string} req.params.location_id - The ID of the location to retrieve.
 * @param {Object} res - The response object.
 * @returns {Object} The location object, including ID, name, privacy, subnational2 code, latitude and longitude.
 * @example
 * // Request:
 * // GET /location/L10020909
 * //
 * // Response:
 * // {
 * //     "location_id": "L10020909",
 * //     "location_name": "Peña Boulevard, Denver, Colorado, US (39.813, -104.787)",
 * //     "location_private": 1,
 * //     "subnational2_code": "US-CO-031",
 * //     "latitude": 39.8128317,
 * //     "longitude": -104.7868704
 * // }
 */
const getLocationByID = async function(req, res) {
  connection.query(`
    SELECT
      location_id,
      location_name,
      location_private,
      subnational2_code,
      latitude,
      longitude
    FROM 
      ebird_location
    WHERE 
      location_id = '${req.params.location_id}';
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
 * @route POST /heatmap-observations
 * @description Search a heatmap of bird sightings, filtered by time range, species, family and location.
 * @param {Object} req - The request object. The request body can contain the following fields:
 *  - startDate {string} The start date for filtering sightings. If not provided, defaults to '2022-12-01'.
 *  - endDate {string} The end date for filtering sightings. If not provided, defaults to today's date.
 *  - commonName {string} The common name of the species to filter by. If not provided, defaults to all species.
 *  - scientificName {string} The scientific name of the species to filter by. If not provided, defaults to all species.
 *  - familyCommonName {string} The common name of the bird family to filter by. If not provided, defaults to all families.
 *  - familyScientificName {string} The scientific name of the bird family to filter by. If not provided, defaults to all families.
 *  - subnational1Name {string} The name of the subnational1 location to filter by. If not provided, defaults to all locations.
 * @param {Object} res - The response object
 * @returns {Object[]} An array of objects, each representing a location with species sightings, including the following fields:
 *  - species_code {string} The species code of the observed bird.
 *  - family_code {string} The family code of the observed bird.
 *  - location_id {string} The location ID of the observed bird.
 *  - latitude {number} The latitude of the location where the observation was made.
 *  - longitude {number} The longitude of the location where the observation was made.
 *  - scientific_name {string} The scientific name of the observed bird.
 *  - common_name {string} The common name of the observed bird.
 *  - family_common_name {string} The common name of the bird family.
 *  - family_scientific_name {string} The scientific name of the bird family.
 *  - subnational1_name {string} The name of the subnational1 location of the observed bird.
 *  - subnational2_name {string} The name of the subnational2 location of the observed bird.
 *  - total_count {number} The total count of observations for this species at this location.
 * @example
 * // Request:
 * // POST /heatmap-obserations
 * // Request Body:
 * // {
 * //     "startDate": "2023-03-03",
 * //     "commonName": "hawk",
 * //     "familyCommonName": "Eagles"
 * // }
 * //
 * // Response:
 * // [
 * //   {
 * //       "species_code": "reshaw",
 * //       "family_code": "accipi1",
 * //       "location_id": "L1000048",
 * //       "latitude": 37.6939406,
 * //       "longitude": -89.3823087,
 * //       "common_name": "Red-shouldered Hawk",
 * //       "scientific_name": "Buteo lineatus",
 * //       "family_common_name": "Hawks, Eagles, and Kites",
 * //       "family_scientific_name": "Accipitridae",
 * //       "subnational1_name": "Illinois",
 * //       "subnational2_name": "Jackson",
 * //       "total_count": 2
 * //   },
 * //   ...
 * // ]
 */
const searchHeatMapObservations = async function(req, res) {
  let { startDate, 
        endDate, 
        commonName, 
        scientificName, 
        familyCommonName, 
        familyScientificName, 
        subnational1Name } = req.body;

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
  familyCommonName = familyCommonName ? familyCommonName.trim().toLowerCase() : undefined;
  familyScientificName = familyScientificName ? familyScientificName.trim().toLowerCase() : undefined;
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
          ${commonName ? `LOWER(common_name) LIKE '%${commonName}%'` : '1 = 1'}
          AND ${scientificName ? `LOWER(scientific_name) LIKE '%${scientificName}%'` : '1 = 1'}
          AND ${startDate ? `CAST(observation_date AS DATE) >= '${startDate}'` : '1 = 1'}
          AND ${endDate ? `CAST(observation_date AS DATE) <= '${endDate}'` : '1 = 1'}
      ), 
      locations_filtered AS (
        SELECT 
          location_id,
          latitude,
          longitude,
          subnational1_name,
          subnational2_name
        FROM 
          ebird_location E
        JOIN subnational2 S2
          ON E.subnational2_code = S2.subnational2_code
        JOIN subnational1 S1
          ON S2.subnational1_code = S1.subnational1_code
        WHERE 
          ${subnational1Name ? `LOWER(S1.subnational1_name) LIKE '%${subnational1Name}%'` : '1 = 1'}
      ),
      families_filtered AS (
        SELECT
          family_code,
          family_common_name,
          family_scientific_name
        FROM
          family
        WHERE
          ${familyCommonName ? `LOWER(family_common_name) LIKE '%${familyCommonName}%'` : '1 = 1'}
          AND ${familyScientificName ? `LOWER(family_scientific_name) LIKE '%${familyScientificName}%'` : '1 = 1'}
      )
    SELECT 
      species_code,
      S.family_code,
      S.location_id,
      latitude,
      longitude,
      common_name,
      scientific_name,
      family_common_name,
      family_scientific_name,
      subnational1_name,
      subnational2_name,
      SUM(observation_count) AS total_count
    FROM 
      sightings_filtered S
    JOIN families_filtered F
      ON S.family_code = F.family_code
    JOIN locations_filtered L
      ON S.location_id = L.location_id
    GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

module.exports = {
  getRandomSpecies,
  getAllSpecies,
  getOneSpecies,
  get5LatestObservationsBySpeciesCode,
  searchSpecificObservationsBySpeciesCode,
  getAllFamilies,
  getOneFamily,
  getAllSpeciesByFamilyCode,
  getLocationByID,
  searchHeatMapObservations
}