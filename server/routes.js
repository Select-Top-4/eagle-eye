const { request } = require('express');
const mysql = require('mysql')
const config = require('./config.json')

/******************
 * ROUTES *
 ******************/

// Route 1: GET /species/random
const birdOfTheDay = async function(req, res) {

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

}

// Route 7: GET /family/species
// parameters: family_code
const familySpecies = async function(req, res) {

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
