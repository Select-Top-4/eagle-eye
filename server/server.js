const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.json());

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
/**
 * familyHeatMap,
  familySpecies,
  familyInfo,
  sightingsRecent,
  sightingsFiltered,
  locationHeatMap,
  speciesInfo,
  birdOfTheDay
 */
  app.get('/family/heat-map', routes.familyHeatMap);
  app.get('/family/species', routes.familySpecies);
  app.get('/family/info', routes.familyInfo);
  app.get('/sightings/recent', routes.sightingsRecent);
  app.get('/sightings/filtered', routes.sightingsFiltered);
  app.post('/location/heat-map', routes.locationHeatMap);
  app.get('/species/info', routes.speciesInfo);
  app.get('/species/random', routes.birdOfTheDay);
  
app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
