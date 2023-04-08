const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.json());

app.get('/random/species', routes.getRandomSpecies);
app.get('/all-species', routes.getAllSpecies);
app.get('/species/:species_code', routes.getOneSpecies);
app.get('/species/:species_code/5-latest-observations', routes.get5LatestObservationsBySpeciesCode);
app.get('/species/:species_code/observations', routes.searchSpecificObservationsBySpeciesCode);
app.get('/families', routes.getAllFamilies);
app.get('/family/:family_code', routes.getOneFamily);
app.get('/family/:family_code/species', routes.getAllSpeciesByFamilyCode);
app.get('/location/:location_id', routes.getLocationByID);
app.get('/heatmap-observations', routes.searchHeatMapObservations);
  
app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
