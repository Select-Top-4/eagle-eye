import React, { useState } from "react";
import { useRef } from "react";
import MapGL, { Source, Layer, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./css/Popup.css";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const BirdMap = ({ birdObservations }) => {
  const mapRef = useRef();

  const [selectedObservation, setSelectedObservation] = useState(null);

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

  const selectedGeojson = selectedObservation
    ? {
        type: "FeatureCollection",
        features: [selectedObservation],
      }
    : {
        type: "FeatureCollection",
        features: [],
      };

  const handleViewportChange = newViewport => {
    setViewport(newViewport);
  };

  return (
    <MapGL
      ref={mapRef}
      {...viewport}
      width="100%"
      height="100%"
      mapStyle="mapbox://styles/mapbox/dark-v10"
      onMove={e => handleViewportChange(e.viewState)}
      mapboxAccessToken={MAPBOX_TOKEN}
      // onClick={(e) => {
      //     const features = mapRef.current.queryRenderedFeatures(e.point, {
      //         layers: ["observations"],
      //     });
      //     setSelectedObservation(features[0]);
      // }}
      onMouseMove={e => {
        const features = mapRef.current.queryRenderedFeatures(e.point, {
          layers: ["observations", "selectedObservationLayer"],
        });
        setSelectedObservation(features[0]);
      }}
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
          onHover={e => {
            setSelectedObservation(e.features[0]);
          }}
        />
      </Source>

      <Source id="selectedObservation" type="geojson" data={selectedGeojson}>
        <Layer
          id="selectedObservationLayer"
          type="circle"
          paint={{
            "circle-radius": 7,
            "circle-color": "#7e57c2",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          }}
        />
      </Source>

      {/* {selectedObservation && (
                <Popup
                    latitude={selectedObservation.geometry.coordinates[1]}
                    longitude={selectedObservation.geometry.coordinates[0]}
                    closeButton={false}
                    closeOnClick={false}
                    onClose={() => setSelectedObservation(null)}
                    anchor="top"
                >
                    <div>
                        <h3>{selectedObservation.properties.common_name}</h3>
                        <p>Scientific Name: {selectedObservation.properties.scientific_name}</p>
                        <p>Family: {selectedObservation.properties.family_common_name}</p>
                        <p>Location: {selectedObservation.properties.subnational1_name}, {selectedObservation.properties.subnational2_name}</p>
                        <p>Total Count: {selectedObservation.properties.total_count}</p>
                    </div>
                </Popup>
            )} */}

      {selectedObservation && (
        <Popup
          latitude={selectedObservation.geometry.coordinates[1]}
          longitude={selectedObservation.geometry.coordinates[0]}
          closeButton={false}
          closeOnClick={false}
          onClose={() => setSelectedObservation(null)}
          offset={20}
          className="custom-popup"
        >
          <div>
            <h3>{selectedObservation.properties.common_name}</h3>
            <p>
              Scientific Name: {selectedObservation.properties.scientific_name}
            </p>
            <p>Family: {selectedObservation.properties.family_common_name}</p>
            <p>
              Location: {selectedObservation.properties.subnational1_name},{" "}
              {selectedObservation.properties.subnational2_name}
            </p>
            <p>Total Count: {selectedObservation.properties.total_count}</p>
          </div>
        </Popup>
      )}
    </MapGL>
  );
};

export default BirdMap;
