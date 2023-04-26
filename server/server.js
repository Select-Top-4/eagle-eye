const express = require("express");
const cors = require("cors");
const redis = require("redis");
const config = require("./config");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});
redisClient.connect().then(() => {
  console.log("Connected to Redis.");
});
app.locals.redisClient = redisClient;
const routes = require("./routes")(redisClient);

const cacheMiddleware = async (req, res, next) => {
  const key = req.originalUrl;
  try {
    const data = await redisClient.get(key);
    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    next();
  }
};

app.get("/random/species", routes.getRandomSpecies);
app.get("/all-species", routes.getAllSpecies);
app.get("/species/:species_code", routes.getOneSpecies);
app.get(
  "/species/:species_code/last-30-daily-observation-count",
  routes.getLast30DailyObservationCountBySpeciesCode
);
app.get(
  "/species/:species_code/5-latest-observations",
  routes.get5LatestObservationsBySpeciesCode
);
app.get(
  "/species/:species_code/observations",
  routes.searchSpecificObservationsBySpeciesCode
);
app.get("/families", routes.getAllFamilies);
app.get("/family/:family_code", routes.getOneFamily);
app.get("/family/:family_code/species", routes.getAllSpeciesByFamilyCode);
app.get("/location/:location_id", routes.getLocationByID);
app.get(
  "/heatmap-observations",
  cacheMiddleware,
  routes.searchHeatMapObservations
);
app.get(
  "/heatmap-observations/species-ranking",
  cacheMiddleware,
  routes.getSpeciesRankingByHeatMapObservations
);

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
