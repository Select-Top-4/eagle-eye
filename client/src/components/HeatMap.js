import React, { useEffect, useState } from "react";
import { useRef } from "react";
import MapGL, { Source, Layer, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import usStates from "../map_data/usstates.json";
import { quantile } from 'd3-array';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const HeatMap = ({ birdObservations }) => {
    const mapRef = useRef();

    const [stateBoundaries, setStateBoundaries] = useState(usStates);
    const [hoveredState, setHoveredState] = useState(null);

    const [viewport, setViewport] = useState({
        latitude: 39.833333,
        longitude: -98.583333,
        zoom: 2.7,
        bearing: 0,
        pitch: 0,
    });

    const handleViewportChange = (newViewport) => {
        setViewport(newViewport);
    };

    const aggregateByState = (observations, stateBoundaries) => {
        const stateData = {};

        observations.forEach((obs) => {
            const state = obs.subnational1_name;
            if (!stateData[state]) {
                stateData[state] = 0;
            }
            stateData[state] += obs.total_count;
        });

        const totalCounts = Object.values(stateData).sort((a, b) => a - b);
        const q1 = quantile(totalCounts, 0.2);
        const q2 = quantile(totalCounts, 0.4);
        const q3 = quantile(totalCounts, 0.6);
        const q4 = quantile(totalCounts, 0.8);

        // Create a deep copy of stateBoundaries
        const updatedStateBoundaries = JSON.parse(JSON.stringify(stateBoundaries));

        updatedStateBoundaries.features.forEach((feature) => {
            const stateName = feature.properties.name;
            const totalCount = stateData[stateName] || 0;
            feature.properties.totalCount = totalCount;
            if (totalCount <= q1) {
                feature.properties.color = "#c6dbef";
            } else if (totalCount <= q2) {
                feature.properties.color = "#9ecae1";
            } else if (totalCount <= q3) {
                feature.properties.color = "#6baed6";
            } else if (totalCount <= q4) {
                feature.properties.color = "#3182bd";
            } else {
                feature.properties.color = "#08519c";
            }
        });

        return updatedStateBoundaries;
    };

    useEffect(() => {
        const updatedStateBoundaries = aggregateByState(birdObservations, stateBoundaries);
        setStateBoundaries(updatedStateBoundaries);
    }, [birdObservations]);

    const handleMouseMove = (e) => {
        const features = e.target.queryRenderedFeatures(e.point, { layers: ["choropleth"] });
        if (features.length > 0) {
            const feature = features[0];
            setHoveredState({
                totalCount: feature.properties.totalCount,
                state: feature.properties.name,
                longitude: e.lngLat.lng,
                latitude: e.lngLat.lat,
            });
        } else {
            setHoveredState(null);
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
            <NavigationControl
                style={{ top: 10, right: 10 }}
            />

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
                </Source>
            )}

            {hoveredState && (
                <Popup
                    latitude={hoveredState.latitude}
                    longitude={hoveredState.longitude}
                    closeButton={false}
                    closeOnClick={false}
                    onClose={() => setHoveredState(null)}
                    anchor="top"
                >
                    <div>
                        <h3>{hoveredState.state}</h3>
                        <p>Total Count: {hoveredState.totalCount}</p>
                    </div>
                </Popup>
            )}

        </MapGL>
    );
};

export default HeatMap;
