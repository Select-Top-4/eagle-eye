import React, { useEffect, useState } from "react";
import { useRef } from "react";
import MapGL, { Source, Layer, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import usStates from "../map_data/usstates.json";
import { quantile } from "d3-array";
import Legend from "./Legend";
import "./css/Popup.css";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const HeatMap = ({ birdObservations }) => {
  const mapRef = useRef();

  const [stateBoundaries, setStateBoundaries] = useState(usStates);
  const [hoveredState, setHoveredState] = useState(null);
  const [hoveredStateName, setHoveredStateName] = useState(null);
  const [quantiles, setQuantiles] = useState(null);
  const [legendLarge, setLegendLarge] = useState(false);

  const [viewport, setViewport] = useState({
    latitude: 39.833333,
    longitude: -98.583333,
    zoom: 2.5,
    bearing: 0,
    pitch: 0,
  });

  const handleViewportChange = newViewport => {
    setViewport(newViewport);
  };

  const aggregateByState = (observations, stateBoundaries) => {
    const stateData = {};
    const updatedStateBoundaries = JSON.parse(JSON.stringify(stateBoundaries));

    observations.forEach(obs => {
      const state = obs.subnational1_name;
      if (!stateData[state]) {
        stateData[state] = 0;
      }
      stateData[state] += obs.total_count;
    });

    const totalCounts = Object.values(stateData).sort((a, b) => a - b);
    const uniqueCounts = new Set(totalCounts);
    const colorScale = ["#fff9c4", "#fff176", "#ffeb3b", "#fdd835", "#fbc02d"];

    if (uniqueCounts.size <= colorScale.length) {
      const sortedUniqueCounts = Array.from(uniqueCounts).sort((a, b) => a - b);

      updatedStateBoundaries.features.forEach(feature => {
        const stateName = feature.properties.name;
        const totalCount = stateData[stateName] || 0;
        feature.properties.totalCount = totalCount;

        const countIndex = sortedUniqueCounts.indexOf(totalCount);
        feature.properties.color = colorScale[countIndex];
      });

      return {
        updatedStateBoundaries,
        quantiles: sortedUniqueCounts,
        legendLarge: false,
      };
    }

    const q1 = quantile(totalCounts, 0.2);
    const q2 = quantile(totalCounts, 0.4);
    const q3 = quantile(totalCounts, 0.6);
    const q4 = quantile(totalCounts, 0.8);

    updatedStateBoundaries.features.forEach(feature => {
      const stateName = feature.properties.name;
      const totalCount = stateData[stateName] || 0;
      feature.properties.totalCount = totalCount;
      if (totalCount <= q1) {
        feature.properties.color = "#fff9c4";
      } else if (totalCount <= q2) {
        feature.properties.color = "#fff176";
      } else if (totalCount <= q3) {
        feature.properties.color = "#ffeb3b";
      } else if (totalCount <= q4) {
        feature.properties.color = "#fdd835";
      } else {
        feature.properties.color = "#fbc02d";
      }
    });

    return {
      updatedStateBoundaries,
      quantiles: [q1, q2, q3, q4],
      legendLarge: true,
    };
  };

  useEffect(() => {
    const { updatedStateBoundaries, quantiles, legendLarge } = aggregateByState(
      birdObservations,
      usStates
    );
    setStateBoundaries(updatedStateBoundaries);
    setQuantiles(quantiles);
    setLegendLarge(legendLarge);
  }, [birdObservations]);

  const handleMouseMove = e => {
    const features = e.target.queryRenderedFeatures(e.point, {
      layers: ["choropleth"],
    });
    if (features.length > 0) {
      const feature = features[0];
      setHoveredState({
        totalCount: feature.properties.totalCount,
        state: feature.properties.name,
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
      });
      setHoveredStateName(feature.properties.name);
    } else {
      setHoveredState(null);
      setHoveredStateName(null);
    }
  };

  return (
    <MapGL
      ref={mapRef}
      {...viewport}
      width="100%"
      height="100%"
      mapStyle="mapbox://styles/mapbox/dark-v10"
      onMove={e => handleViewportChange(e.viewState)}
      onMouseMove={handleMouseMove}
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <NavigationControl style={{ top: 10, right: 10 }} />

      {stateBoundaries && (
        <Source type="geojson" data={stateBoundaries}>
          <Layer
            id="choropleth"
            type="fill-extrusion"
            paint={{
              "fill-extrusion-color": ["get", "color"],
              "fill-extrusion-base": 0,
              "fill-extrusion-opacity": 0.8,
            }}
          />
        </Source>
      )}

      {stateBoundaries && (
        <Source type="geojson" data={stateBoundaries}>
          <Layer
            id="choropleth"
            type="fill-extrusion"
            paint={{
              "fill-extrusion-color": ["get", "color"],
              "fill-extrusion-height": ["*", ["get", "totalCount"], 10],
              "fill-extrusion-base": 0,
              "fill-extrusion-opacity": 0.8,
            }}
          />
          <Layer
            id="state-borders"
            type="line"
            paint={{
              "line-color": "#ffffff",
              "line-width": 1,
              "line-opacity": 0.8,
            }}
          />
          <Layer
            id="state-hover"
            type="fill"
            paint={{
              "fill-color": "#000000",
              "fill-opacity": 0.3,
            }}
            filter={["==", "name", hoveredStateName || ""]}
          />
        </Source>
      )}

      {hoveredState && (
        <Popup
          latitude={hoveredState.latitude}
          longitude={hoveredState.longitude}
          closeButton={false}
          closeOnClick={false}
          onClose={() => setHoveredState(null)}
          offset={20}
          className="custom-popup"
        >
          <div>
            <h3>{hoveredState.state}</h3>
            <p>Total Count: {hoveredState.totalCount}</p>
          </div>
        </Popup>
      )}

      <div style={{ position: "absolute", bottom: 30, right: 10 }}>
        <Legend quantiles={quantiles} legendLarge={legendLarge} />
      </div>
    </MapGL>
  );
};

export default HeatMap;
