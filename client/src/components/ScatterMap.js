import React, { useState, useCallback } from "react";
import { useRef } from "react";
import MapGL, { Source, Layer, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./css/Popup.css";
import { Link } from "react-router-dom";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const BirdMap = ({ birdObservations }) => {
  const mapRef = useRef();
  const [hoveredObservation, setHoveredObservation] = useState(null);
  const [clickedObservation, setClickedObservation] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 39.833333,
    longitude: -98.583333,
    zoom: 2.5,
    bearing: 0,
    pitch: 0,
  });

  const geojson = {
    type: "FeatureCollection",
    features: birdObservations.map(observation => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [observation.longitude, observation.latitude],
      },
      properties: observation,
    })),
  };

  const selectedGeojson = hoveredObservation
    ? {
        type: "FeatureCollection",
        features: [hoveredObservation],
      }
    : {
        type: "FeatureCollection",
        features: [],
      };

  const handleViewportChange = newViewport => {
    setViewport(newViewport);
  };

  const handleClick = useCallback(e => {
    if (mapRef.current.getLayer("observations")) {
      const features = mapRef.current.queryRenderedFeatures(e.point, {
        layers: ["observations"],
      });
      if (features.length) {
        setClickedObservation(features[0]);
      } else {
        setClickedObservation(null);
      }
    }
  }, []);

  const handleMouseMove = useCallback(e => {
    if (mapRef.current.getLayer("observations")) {
      const features = mapRef.current.queryRenderedFeatures(e.point, {
        layers: ["observations"],
      });
      if (features.length) {
        setHoveredObservation(features[0]);
      } else {
        setHoveredObservation(null);
      }
    }
  }, []);

  return (
    <MapGL
      ref={mapRef}
      {...viewport}
      width="100%"
      height="100%"
      mapStyle="mapbox://styles/mapbox/dark-v10"
      onMove={e => handleViewportChange(e.viewState)}
      mapboxAccessToken={MAPBOX_TOKEN}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
    >
      <NavigationControl style={{ top: 10, right: 10 }} />

      <Source type="geojson" data={geojson}>
        <Layer
          id="observations"
          type="circle"
          paint={{
            "circle-radius": 4,
            "circle-color": "#f1c40f",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff",
          }}
        />
      </Source>

      <Source id="hoveredObservation" type="geojson" data={selectedGeojson}>
        <Layer
          id="hoveredObservationLayer"
          type="circle"
          paint={{
            "circle-radius": 7,
            "circle-color": "#7e57c2",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          }}
        />
      </Source>

      {hoveredObservation && !clickedObservation && (
        <Popup
          latitude={hoveredObservation.geometry.coordinates[1]}
          longitude={hoveredObservation.geometry.coordinates[0]}
          closeButton={false}
          closeOnClick={false}
          onClose={() => setHoveredObservation(null)}
          offset={20}
          className="custom-popup"
        >
          <div className="popup-content">
            <div className="popup-image-container">
              <img
                className="popup-image"
                src={`https://${hoveredObservation.properties.species_img_link}`}
                alt={hoveredObservation.properties.common_name}
              />
            </div>
            <div className="popup-info">
              <h3>
                <Link
                  to={`/species/${hoveredObservation.properties.species_code}`}
                  className="popup-link"
                >
                  {hoveredObservation.properties.common_name}
                </Link>
              </h3>
              <p>Family: {hoveredObservation.properties.family_common_name}</p>
              <p>
                Location: {hoveredObservation.properties.subnational1_name},
                {" " + hoveredObservation.properties.subnational2_name}
              </p>
              <p>Total Count: {hoveredObservation.properties.total_count}</p>
            </div>
          </div>
        </Popup>
      )}

      {clickedObservation && (
        <Popup
          latitude={clickedObservation.geometry.coordinates[1]}
          longitude={clickedObservation.geometry.coordinates[0]}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setClickedObservation(null)}
          offset={20}
          className="custom-popup"
        >
          <div className="popup-content">
            <div className="popup-image-container">
              <img
                className="popup-image"
                src={`https://${clickedObservation.properties.species_img_link}`}
                alt={clickedObservation.properties.common_name}
              />
            </div>
            <div className="popup-info">
              <h3>
                <Link
                  to={`/species/${clickedObservation.properties.species_code}`}
                  className="popup-link"
                >
                  {clickedObservation.properties.common_name}
                </Link>
              </h3>
              <p>Family: {clickedObservation.properties.family_common_name}</p>
              <p>
                Location: {clickedObservation.properties.subnational1_name},
                {" " + clickedObservation.properties.subnational2_name}
              </p>
              <p>Total Count: {clickedObservation.properties.total_count}</p>
            </div>
          </div>
        </Popup>
      )}
    </MapGL>
  );
};

export default BirdMap;
